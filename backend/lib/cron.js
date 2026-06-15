import cron from 'node-cron';
import { query } from './db.js';

/**
 * Monthly Volume & Tier Evaluation
 * Runs on the 1st of every month at 00:01
 */
export const startMonthlyEvaluation = () => {
  cron.schedule('1 0 1 * *', async () => {
    console.log('⏰ Starting Monthly B2B Volume Evaluation...');
    
    try {
      // 1. Get all approved B2B partners
      const partnersRes = await query("SELECT profile_id, tier_name FROM b2b_partners WHERE status = 'approved'");
      const partners = partnersRes.rows;

      for (const partner of partners) {
        // 2. Calculate volume for the previous month (PAID or SHIPPED only)
        // Previous month calculation logic
        const volumeRes = await query(
          `SELECT COALESCE(SUM(oi.quantity * 0.25), 0) as total_kg 
           FROM orders o
           JOIN order_items oi ON o.id = oi.order_id
           WHERE o.profile_id = $1 
           AND o.status IN ('PAID', 'SHIPPED', 'DELIVERED')
           AND o.created_at >= date_trunc('month', current_date - interval '1 month')
           AND o.created_at < date_trunc('month', current_date)`,
          [partner.profile_id]
        );

        const totalKg = parseFloat(volumeRes.rows[0].total_kg);
        let isSilverEligible = totalKg >= 15;
        
        // 3. Reset Tier if threshold not met, OR set eligibility for next month
        let newTier = partner.tier_name;
        if (partner.tier_name === 'Silver' && totalKg < 15) {
          newTier = 'Bronze';
          console.log(`📉 Partner ${partner.profile_id} reverted to Bronze (Volume: ${totalKg}kg)`);
        }

        await query(
          `UPDATE b2b_partners 
           SET tier_name = $1, is_silver_eligible = $2, updated_at = CURRENT_TIMESTAMP 
           WHERE profile_id = $3`,
          [newTier, isSilverEligible, partner.profile_id]
        );

        console.log(`✅ Evaluated Partner ${partner.profile_id}: ${totalKg}kg. Silver Eligible: ${isSilverEligible}`);
      }

      console.log('🎉 Monthly B2B Evaluation Complete.');
    } catch (error) {
      console.error('❌ Monthly Evaluation Error:', error);
    }
  });
};
