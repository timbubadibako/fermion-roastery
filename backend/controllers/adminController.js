import { supabase } from '../lib/supabase.js';
import { publishEvent } from '../lib/ably.js';
import { sendWelcomeB2BEmail, sendOrderShippedEmail } from '../lib/emailService.js';
import { subDays, startOfDay, endOfDay, differenceInDays, format } from 'date-fns';
import { logError, logInfo } from '../lib/logger.js';
import { sanitizeError } from '../lib/security.js';
import { recordAuditEvent } from '../lib/audit.js';
import { mapInvoicesExport, mapOrdersExport, mapPartnersExport, toCsv } from '../lib/exporters.js';

// 0. Get Admin Stats for Dashboard Overview
export const getAdminStats = async (req, res) => {
  const { startDate, endDate, days } = req.query;
  
  let start, end;
  
  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
  } else {
    const d = parseInt(days) || 30;
    end = new Date();
    start = subDays(end, d);
  }

  // Sanitize to start/end of day
  const finalStart = startOfDay(start).toISOString();
  const finalEnd = endOfDay(end).toISOString();
  const diffDays = differenceInDays(new Date(finalEnd), new Date(finalStart));
  const isMonthly = diffDays > 60;

  try {
    // Total Revenue
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .neq('status', 'CANCELLED')
      .gte('created_at', finalStart)
      .lte('created_at', finalEnd);

    if (revenueError) throw revenueError;
    const totalRevenue = revenueData.reduce((sum, row) => sum + Number(row.total_amount), 0);
    
    // Volume Sold
    const { data: volumeData, error: volumeError } = await supabase
      .from('order_items')
      .select('quantity, orders!inner(status, created_at)')
      .neq('orders.status', 'CANCELLED')
      .gte('orders.created_at', finalStart)
      .lte('orders.created_at', finalEnd);

    if (volumeError) throw volumeError;
    const totalVolumeKg = volumeData.reduce((sum, row) => sum + (Number(row.quantity) * 0.25), 0);

    // Global Stats
    const { count: pendingB2B, error: pendingError } = await supabase
      .from('b2b_partners')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    const { count: activePartners, error: activeError } = await supabase
      .from('b2b_partners')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    if (activeError) throw activeError;

    // Revenue Trends - fetching orders and grouping in JS
    const { data: trendOrders, error: trendError } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .neq('status', 'CANCELLED')
      .gte('created_at', finalStart)
      .lte('created_at', finalEnd)
      .order('created_at', { ascending: true });

    if (trendError) throw trendError;

    // Grouping logic for trends
    const trendsMap = {};
    
    // Initialize trendsMap with all dates/months in range to ensure zeros are present
    let current = new Date(finalStart);
    const endLimit = new Date(finalEnd);
    
    while (current <= endLimit) {
      const label = isMonthly ? format(current, 'MMM yy') : format(current, 'dd MMM');
      if (!trendsMap[label]) trendsMap[label] = 0;
      
      if (isMonthly) {
        current.setMonth(current.getMonth() + 1);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }

    trendOrders.forEach(order => {
      const date = new Date(order.created_at);
      const label = isMonthly ? format(date, 'MMM yy') : format(date, 'dd MMM');
      if (trendsMap[label] !== undefined) {
        trendsMap[label] += Number(order.total_amount);
      }
    });

    const revenueTrends = Object.entries(trendsMap).map(([label, revenue]) => ({ label, revenue }));

    // Recent Orders
    const { data: recentOrders, error: recentError } = await supabase
      .from('orders')
      .select('id, customer_name, customer_email, total_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    res.status(200).json({
      revenue: totalRevenue,
      volume: totalVolumeKg,
      pendingB2B: pendingB2B || 0,
      activeSubs: activePartners || 0,
      revenueTrends,
      recentOrders
    });
  } catch (error) {
    logError('admin.stats.failed', error);
    res.status(500).json(sanitizeError(error, "Failed to fetch dashboard stats"));
  }
};

// 1. Get all B2B Partners (Pending, Approved, Rejected)
export const getB2bPartners = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('b2b_partners')
      .select(`
        id, 
        profile_id,
        company_name, 
        address, 
        estimated_volume_kg, 
        status, 
        tier_name, 
        created_at,
        profiles (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Flatten the profiles object to match original structure if needed
    const flattenedData = data.map(partner => ({
      ...partner,
      email: partner.profiles?.email,
      full_name: partner.profiles?.full_name
    }));
    
    res.status(200).json(flattenedData);
  } catch (error) {
    console.error('Error fetching B2B partners:', error);
    res.status(500).json({ message: "Failed to fetch partners", error: error.message });
  }
};

// 2. Update Partner Status & Assign Tier
export const updatePartnerStatus = async (req, res) => {
  const { id } = req.params;
  const { status, tier_name } = req.body;

  try {
    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended', 'flagged', 'onboarding', 'awaiting_contract_review'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updates = {};
    if (status) updates.status = status;
    if (tier_name !== undefined) updates.tier_name = tier_name;
    updates.updated_at = new Date().toISOString();

    if (Object.keys(updates).length === 1 && updates.updated_at) {
       // Only updated_at is there, but we checked for no fields to update original logic
    }
    
    // Original check for no fields to update
    if (!status && tier_name === undefined) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const { data, error } = await supabase
      .from('b2b_partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "Partner application not found" });
    }

    // Email hook
    if (status === 'approved' && data.profile_id) {
      // Fetch user profile email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', data.profile_id)
        .single();
        
      if (profile && profile.email) {
        // Run in background
        sendWelcomeB2BEmail(profile.email, data.company_name || profile.full_name || 'Mitra B2B').catch(e => console.error(e));
      }
    }

    await recordAuditEvent({
      actorId: req.user?.id,
      action: status === 'approved' ? 'partner.approve' : 'partner.status_update',
      entityType: 'b2b_partner',
      entityId: id,
      details: { status, tier_name },
    });

    res.status(200).json({ 
      message: "Data mitra berhasil diperbarui", 
      partner: data 
    });
  } catch (error) {
    logError('admin.partner.update_failed', error, { partnerId: id });
    res.status(500).json(sanitizeError(error, "Gagal memperbarui data mitra"));
  }
};

// Delete Partner
export const deletePartner = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('b2b_partners')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: "Partner application not found" });
    }
    await recordAuditEvent({
      actorId: req.user?.id,
      action: 'partner.delete',
      entityType: 'b2b_partner',
      entityId: id,
    });
    res.status(200).json({ message: "Application successfully cancelled", id: data.id });
  } catch (error) {
    logError('admin.partner.delete_failed', error, { partnerId: id });
    res.status(500).json(sanitizeError(error, "Failed to cancel application"));
  }
};

// 3. Create B2B Contract
export const createContract = async (req, res) => {
  const { profile_id, end_date, contract_type = 'Bronze' } = req.body;
  try {
    // Determine sequence
    const { data: seqData, error: seqError } = await supabase
      .from('b2b_contracts')
      .select('contract_sequence')
      .eq('profile_id', profile_id)
      .order('contract_sequence', { ascending: false })
      .limit(1);

    if (seqError) throw seqError;
    const nextSeq = (seqData?.[0]?.contract_sequence || 0) + 1;

    // Insert contract
    const { data, error } = await supabase
      .from('b2b_contracts')
      .insert({
        profile_id,
        end_date,
        contract_sequence: nextSeq,
        contract_type
      })
      .select()
      .single();

    if (error) throw error;

    // Update partner status and logo logic can be added later
    res.status(201).json({ message: "Contract created successfully", contract: data });
  } catch (error) {
    logError('admin.contract.create_failed', error, { profileId: profile_id });
    res.status(500).json(sanitizeError(error, "Failed to create contract"));
  }
};

// 3.5 Get Maintenance Schedule
export const getMaintenanceSchedule = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('b2b_contracts')
      .select(`
        *,
        b2b_partners!inner (
          company_name,
          address
        )
      `)
      .gte('contract_sequence', 2)
      .eq('status', 'active')
      .order('end_date', { ascending: true });

    if (error) throw error;

    const flattenedData = data.map(contract => ({
      ...contract,
      company_name: contract.b2b_partners?.company_name,
      address: contract.b2b_partners?.address
    }));

    res.status(200).json(flattenedData);
  } catch (error) {
    console.error('Error fetching maintenance schedule:', error);
    res.status(500).json({ message: "Failed to fetch maintenance schedule", error: error.message });
  }
};

// 3.6 Get Churn Alerts
export const getChurnAlerts = async (req, res) => {
  try {
    // This one is a bit more complex with GROUP BY and HAVING.
    // For now, we'll fetch all approved partners and their last orders separately if needed,
    // or use a view if we can. But we'll try to do it with what we have.
    // Actually, maybe we can just use RPC if it's too complex.
    // Let's try to do it in JS for now as a fallback if no RPC.
    
    const { data: partners, error: pError } = await supabase
      .from('b2b_partners')
      .select('company_name, profile_id')
      .eq('status', 'approved');

    if (pError) throw pError;

    const churnAlerts = [];
    for (const partner of partners) {
      const { data: lastOrder, error: oError } = await supabase
        .from('orders')
        .select('created_at')
        .eq('profile_id', partner.profile_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (oError && oError.code !== 'PGRST116') throw oError; // PGRST116 is "no rows returned"

      const lastOrderDate = lastOrder?.created_at;
      const daysSinceLastOrder = lastOrderDate 
        ? differenceInDays(new Date(), new Date(lastOrderDate))
        : Infinity;

      if (daysSinceLastOrder > 45 || !lastOrderDate) {
        churnAlerts.push({
          company_name: partner.company_name,
          profile_id: partner.profile_id,
          last_order_date: lastOrderDate
        });
      }
    }

    res.status(200).json(churnAlerts);
  } catch (error) {
    console.error('Error fetching churn alerts:', error);
    res.status(500).json({ message: "Failed to fetch churn alerts", error: error.message });
  }
};

// 4. Get All Orders
export const getOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          quantity,
          unit_price,
          variant_weight,
          variant_grind
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform data to match original structure (items instead of order_items)
    const transformedData = data.map(order => ({
      ...order,
      items: order.order_items || []
    }));
    
    res.status(200).json(transformedData);
  } catch (error) {
    logError('admin.orders.fetch_failed', error);
    res.status(500).json(sanitizeError(error, "Failed to fetch orders"));
  }
};

// 5. Update Order Status (Roasting/Shipping)
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, shipping_awb, shipping_courier, rejection_reason, qcData } = req.body;

  try {
    const validStatuses = ['UNPAID', 'NET30', 'PENDING_CASH', 'PAID', 'ROASTING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updates = {};
    if (status) updates.status = status;
    if (shipping_awb !== undefined) updates.shipping_awb = shipping_awb;
    if (shipping_courier !== undefined) updates.shipping_courier = shipping_courier;
    if (rejection_reason !== undefined) updates.rejection_reason = rejection_reason;
    
    if (qcData) {
      if (qcData.sweetness !== undefined) updates.qc_sweetness = qcData.sweetness;
      if (qcData.acidity !== undefined) updates.qc_acidity = qcData.acidity;
      if (qcData.body !== undefined) updates.qc_body = qcData.body;
    }

    if (Object.keys(updates).length === 0) return res.status(400).json({ message: "No fields to update" });

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "Order not found" });
    }

    publishEvent('orders', 'order_updated', { id: id, status: status || data.status });

    // Email hook
    if (status === 'SHIPPED' && data.customer_email) {
      sendOrderShippedEmail(
        data.customer_email,
        data.customer_name || 'Coffee Lover',
        data.id,
        data.shipping_courier,
        data.shipping_awb
      ).catch(e => console.error("Email Error:", e));
    }

    await recordAuditEvent({
      actorId: req.user?.id,
      action: status === 'SHIPPED' ? 'order.release_shipping' : status === 'PAID' ? 'order.confirm_payment' : 'order.update',
      entityType: 'order',
      entityId: id,
      details: { status, shipping_awb, shipping_courier },
    });
    logInfo('admin.order.updated', { orderId: id, status: status || data.status });

    res.status(200).json({ message: "Order updated successfully", order: data });
  } catch (error) {
    logError('admin.order.update_failed', error, { orderId: id });
    res.status(500).json(sanitizeError(error, "Failed to update order"));
  }
};

// 6. Get Site Settings
export const getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) throw error;

    const settings = data.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json(sanitizeError(error, "Error fetching settings"));
  }
};

// 7. Update Site Settings
export const updateSettings = async (req, res) => {
  const settings = req.body; // Object with key-value pairs
  try {
    const upsertData = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(upsertData, { onConflict: 'key' });

    if (error) throw error;

    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    res.status(500).json(sanitizeError(error, "Error updating settings"));
  }
};

const sendCsv = async ({ res, filename, rows, audit }) => {
  const csv = toCsv(rows);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await recordAuditEvent(audit);
  return res.status(200).send(csv);
};

export const exportOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(product_name, quantity, variant_weight)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return sendCsv({
      res,
      filename: `fermion-orders-${new Date().toISOString().slice(0, 10)}.csv`,
      rows: mapOrdersExport(data || []),
      audit: { actorId: req.user?.id, action: 'export.orders', entityType: 'report', entityId: 'orders' },
    });
  } catch (error) {
    logError('admin.export.orders_failed', error);
    return res.status(500).json(sanitizeError(error, 'Gagal mengekspor laporan pesanan'));
  }
};

export const exportPartners = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('b2b_partners')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return sendCsv({
      res,
      filename: `fermion-partners-${new Date().toISOString().slice(0, 10)}.csv`,
      rows: mapPartnersExport(data || []),
      audit: { actorId: req.user?.id, action: 'export.partners', entityType: 'report', entityId: 'partners' },
    });
  } catch (error) {
    logError('admin.export.partners_failed', error);
    return res.status(500).json(sanitizeError(error, 'Gagal mengekspor laporan mitra'));
  }
};

export const exportInvoices = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, customer_name, status, payment_method, total_amount, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return sendCsv({
      res,
      filename: `fermion-invoices-${new Date().toISOString().slice(0, 10)}.csv`,
      rows: mapInvoicesExport(data || []),
      audit: { actorId: req.user?.id, action: 'export.invoices', entityType: 'report', entityId: 'invoices' },
    });
  } catch (error) {
    logError('admin.export.invoices_failed', error);
    return res.status(500).json(sanitizeError(error, 'Gagal mengekspor daftar invoice'));
  }
};
