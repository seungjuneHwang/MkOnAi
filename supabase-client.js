// supabase-client.js
// HTML <head>에 <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> 추가 후 사용

const SUPABASE_URL = 'https://vaubeijttngdjwelxsei.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__LgVDo_7-xHGbptI4c5MpA_cl_8qzbo';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 마케팅온 AI 백엔드 데이터 서비스
 */
window.MarketingDB = {
  // 1. AI 생성 콘텐츠 목록 불러오기
  async getContents() {
    const { data, error } = await db
      .from('generated_contents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('콘텐츠 조회 실패:', error);
    return data || [];
  },

  // 2. AI 생성 콘텐츠 저장하기 (예약/임시저장)
  async saveContent({ category, channel, topic, title, body, hashtags, status = 'scheduled', scheduled_date = null }) {
    const { data, error } = await db
      .from('generated_contents')
      .insert([{ category, channel, topic, title, body, hashtags, status, scheduled_date }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // 3. 고객 리뷰 목록 불러오기
  async getReviews() {
    const { data, error } = await db
      .from('store_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('리뷰 조회 실패:', error);
    return data || [];
  },

  // 4. 리뷰 AI 답글 등록/수정하기
  async updateReviewReply(reviewId, replyText) {
    const { data, error } = await db
      .from('store_reviews')
      .update({ ai_reply: replyText, is_replied: true })
      .eq('id', reviewId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // 5. 랜딩 페이지 무료 체험 신청 저장하기
  async submitLead({ store_name, phone_or_email, category }) {
    const { data, error } = await db
      .from('waitlist_leads')
      .insert([{ store_name, phone_or_email, category }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};