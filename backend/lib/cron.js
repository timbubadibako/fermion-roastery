import cron from 'node-cron';
import { supabase } from './supabase.js';

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
            const weightStr = (item.variant_weight || "250g").toLowerCase();
            
            let weightInKg = 0.25; // Default 250g
            if (weightStr.includes('500g')) weightInKg = 0.5;
            else if (weightStr.includes('1kg') || weightStr.includes('1000g')) weightInKg = 1;
            else {
              const match = weightStr.match(/(\d+)(g|kg)/);
              if (match) {
                const val = parseInt(match[1]);
                const unit = match[2];
                weightInKg = unit === 'kg' ? val : val / 1000;
              }
            }
            totalKg += quantity * weightInKg;
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
