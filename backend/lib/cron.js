import cron from 'node-cron';
import { supabase } from './supabase.js';

const parseWeightToKg = (value) => {
  if (value == null) return 0.25;
  const match = String(value).trim().toLowerCase().match(/(\d+(?:\.\d+)?)(g|kg)/);
  if (!match) return 0.25;

  const numericWeight = Number(match[1]);
  if (!Number.isFinite(numericWeight) || numericWeight <= 0) return 0.25;

  return match[2] === 'kg' ? numericWeight : numericWeight / 1000;
};

/**
 * Monthly Volume & Tier Evaluation
 * Runs on the 1st of every month at 00:01
 */
export const startMonthlyEvaluation = () => {
  cron.schedule('1 0 1 * *', async () => {
    console.log('⏰ Starting Monthly B2B Volume Evaluation...');
    
    try {
      // 1. Get all approved B2B partners
      const { data: partners, error: partnerError } = await supabase
        .from('b2b_partners')
        .select('profile_id, tier_name')
        .eq('status', 'approved');

      if (partnerError) throw partnerError;

      const now = new Date();
      const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const firstDayCurrMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      for (const partner of partners) {
        // 2. Calculate volume for the previous month (PAID, SHIPPED, or DELIVERED only)
        const { data: orders, error: orderError } = await supabase
          .from('orders')
          .select(`
            id,
            status,
            created_at,
            items:order_items(quantity, variant_weight)
          `)
          .eq('profile_id', partner.profile_id)
          .in('status', ['PAID', 'SHIPPED', 'DELIVERED'])
          .gte('created_at', firstDayPrevMonth)
          .lt('created_at', firstDayCurrMonth);

        if (orderError) {
          console.error(`Error fetching orders for partner ${partner.profile_id}:`, orderError);
          continue;
        }

        let totalKg = 0;
        orders.forEach(order => {
          order.items.forEach(item => {
            const quantity = item.quantity || 0;
            totalKg += quantity * parseWeightToKg(item.variant_weight);
          });
        });

        let isSilverEligible = totalKg >= 15;
        
        // 3. Reset Tier if threshold not met, OR set eligibility for next month
        let newTier = partner.tier_name;
        if (partner.tier_name === 'Silver' && totalKg < 15) {
          newTier = 'Bronze';
          console.log(`📉 Partner ${partner.profile_id} reverted to Bronze (Volume: ${totalKg}kg)`);
        }

        const { error: updateError } = await supabase
          .from('b2b_partners')
          .update({ 
            tier_name: newTier, 
            is_silver_eligible: isSilverEligible, 
            updated_at: new Date().toISOString() 
          })
          .eq('profile_id', partner.profile_id);

        if (updateError) {
          console.error(`Error updating partner ${partner.profile_id}:`, updateError);
        } else {
          console.log(`✅ Evaluated Partner ${partner.profile_id}: ${totalKg}kg. Silver Eligible: ${isSilverEligible}`);
        }
      }

      console.log('🎉 Monthly B2B Evaluation Complete.');
    } catch (error) {
      console.error('❌ Monthly Evaluation Error:', error);
    }
  });
};
