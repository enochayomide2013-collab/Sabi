import { SaboAiMessage } from '../types';
import { storageService } from './storageService';

export class SaboAiService {
  /**
   * Processes questions about SABI, Nigerian food prices, rumor debunking, and community tasks
   */
  public static async askSabo(userQuestion: string): Promise<SaboAiMessage> {
    // Artificial small delay for natural conversational rhythm
    await new Promise(resolve => setTimeout(resolve, 600));

    const q = userQuestion.toLowerCase().trim();
    const user = storageService.getUser();
    const loc = storageService.getLocation();

    // 1. SABI Points & Rewards
    if (q.includes('point') || q.includes('pts') || q.includes('earn') || q.includes('reward') || q.includes('cash') || q.includes('money') || q.includes('bonus')) {
      return {
        id: `sabo_${Date.now()}`,
        sender: 'sabo',
        text: `**Stat Points Guide:**\n\nStat Points represent your community credibility and trustworthiness in verifying local truths across Nigeria. **Points are not cash**—they measure consensus accuracy.\n\n**How you earn points:**\n- **+100 PTS:** Sign up and create your verified profile\n- **+25 PTS:** Complete an on-ground verification task near you\n- **+15 PTS:** Submit verified market price logs\n- **+10 PTS:** Submit a news or rumor claim with evidence\n- **+5 PTS:** Participate in *The Sabiers* group chat discussions\n\n**Your Current Balance:** You currently have **${user.sabiPoints} PTS** with **${user.trustLevel}** status!`,
        timestamp: 'Just now',
        suggestedActions: [
          { label: 'View My Profile & Badges', tab: 'profile' },
          { label: 'Open Verification Tasks', tab: 'verify' },
          { label: 'Check Market Prices', tab: 'market' }
        ],
        sources: ['SABI Trust Framework', 'Community Consensus Algorithm']
      };
    }

    // 2. How SABI works / Verification system
    if (q.includes('how sabi work') || q.includes('what is sabi') || q.includes('about sabi') || q.includes('who are you') || q.includes('sabo') || q.includes('truth')) {
      return {
        id: `sabo_${Date.now()}`,
        sender: 'sabo',
        text: `**Hello! I am Sabo AI, your intelligent guide for SABI Nigeria.**\n\n**SABI** (*"You Sabi Truth"*) is Nigeria's decentralized community-powered truth and market intelligence network. We combat viral misinformation and track authentic food prices through:\n\n1. **AI Forensics & OCR:** Scans circulating screenshots, videos, and voice notes for manipulation and outdated media markers.\n2. **Hyper-Local Geofenced Consensus:** Verification tasks are dispatched directly to nearby on-ground contributors (within 5-10km).\n3. **Consensus Verdicts:** When trusted contributors inspect the location or stall, SABI publishes verified truth cards labeled **TRUE**, **FALSE**, or **OUTDATED MEDIA**.\n4. **Real-Time Market Tracking:** Daily commodity price checks across Mile 12, Bodija, Dei-Dei, Dawanau, Onitsha, and Oil Mill.\n\nHow can I help you today?`,
        timestamp: 'Just now',
        suggestedActions: [
          { label: 'Explore Verified Truths', tab: 'truth' },
          { label: 'Join The Sabiers Chat', tab: 'sabiers' },
          { label: 'Report a Suspicious Claim', tab: 'report' }
        ],
        sources: ['SABI Core Architecture', 'Fact-Checking Guidelines']
      };
    }

    // 3. Rice, Tomato, Food and Market Prices
    if (q.includes('rice') || q.includes('tomato') || q.includes('price') || q.includes('market') || q.includes('garri') || q.includes('food') || q.includes('palm oil') || q.includes('yam') || q.includes('cost')) {
      return {
        id: `sabo_${Date.now()}`,
        sender: 'sabo',
        text: `**Latest Verified Market Prices (${loc.state} / National Summary):**\n\n- 🍅 **Fresh Tomatoes (Large Rafia Basket):** ₦52,000–₦55,000 at Mile 12 Lagos | ₦28,000 at Bodija Ibadan (*Trend: 12% Down due to heavy northern arrivals*).\n- 🍚 **Parboiled Foreign Rice (50kg Bag):** ₦104,000–₦107,000 at Dei-Dei & Wuse Abuja | ₦105,000 at Mile 12 (*Debunked rumor claiming ₦90k*).\n- 🌾 **Local Polished Rice (50kg Bag):** ₦88,000–₦92,000 at Dawanau Kano & Bodija.\n- 🛢️ **Pure Palm Oil (25L Yellow Keg):** ₦42,000 at Oil Mill Market Port Harcourt | ₦44,500 in Lagos.\n- 🥣 **White / Yellow Garri (50kg Bag):** ₦38,000–₦42,000.\n\nWould you like to log a live price from your local market or compare historical price trends?`,
        timestamp: 'Just now',
        suggestedActions: [
          { label: 'Open Market Price Tracker', tab: 'market' },
          { label: 'Check Recipe Ingredient Costs', tab: 'recipe' },
          { label: 'Chat with Market Spotters', tab: 'sabiers' }
        ],
        sources: ['SABI National Market Index', 'Verified Merchant Logs']
      };
    }

    // 4. Fuel & Transit / Viral Rumors
    if (q.includes('fuel') || q.includes('petrol') || q.includes('scarcity') || q.includes('bridge') || q.includes('onitsha') || q.includes('dangote') || q.includes('fake') || q.includes('rumor')) {
      return {
        id: `sabo_${Date.now()}`,
        sender: 'sabo',
        text: `**Latest Fact-Check Summary on Trending Rumors:**\n\n1. **Fuel Queues in Yaba / Lagos:** 🛑 **OUTDATED MEDIA** — Viral video circulating online was proven by timestamp and billboard analysis to be from May 2024. Active stations along Herbert Macaulay are operating normally with standard official pump pricing.\n2. **Second Niger Bridge Closure:** 🛑 **FALSE** — On-ground verifiers in Asaba and Onitsha confirmed all link corridors and toll bridges are fully open with free-flowing traffic.\n3. **Dangote Cement ₦5,200 Promo Letter:** 🛑 **FALSE** — Letter is forged without cryptographic official stamps; standard distributor price is ₦8,400–₦9,000.\n\nAlways submit suspicious media via the **Report** tab before forwarding on WhatsApp!`,
        timestamp: 'Just now',
        suggestedActions: [
          { label: 'View Verified Truth Cards', tab: 'truth' },
          { label: 'Report a WhatsApp Rumor', tab: 'report' }
        ],
        sources: ['SABI Verification Desk', 'Federal Ministry of Works', 'Live Camera Feeds']
      };
    }

    // 5. The Sabiers Group Chat
    if (q.includes('sabier') || q.includes('chat') || q.includes('group') || q.includes('community') || q.includes('message')) {
      return {
        id: `sabo_${Date.now()}`,
        sender: 'sabo',
        text: `**Welcome to The Sabiers Community!**\n\n*The Sabiers* is our live interactive group chat where verified spotters, market elders, and fact-checkers from every state in Nigeria share real-time alerts.\n\n**Active Channels:**\n- 🌍 **#general:** Community-wide announcements & discussions\n- 🛍️ **#market-prices:** Live food and commodity price spotters\n- 🚨 **#rumor-alerts:** Rapid debunking of viral broadcasts\n- 📍 **#lagos, #abuja-north, #east-south:** Regional verification hubs\n\nYou can chat, share price tags, and react with emojis to fellow Sabiers!`,
        timestamp: 'Just now',
        suggestedActions: [
          { label: 'Enter The Sabiers Chat', tab: 'sabiers' },
          { label: 'View Top Contributors', tab: 'profile' }
        ],
        sources: ['The Sabiers Network Directory']
      };
    }

    // 6. Recipes & Nigerian Cooking
    if (q.includes('recipe') || q.includes('cook') || q.includes('jollof') || q.includes('egusi') || q.includes('soup') || q.includes('efo')) {
      return {
        id: `sabo_${Date.now()}`,
        sender: 'sabo',
        text: `**Nigerian Recipes & Live Ingredient Costing:**\n\nSABI dynamically calculates the exact cost of popular Nigerian meals based on verified market prices:\n\n- 🍲 **Authentic Smoky Party Jollof Rice:** ~₦12,500 for 6 servings (*parboiled rice, fresh tomatoes, tatashe, shombo, thyme, spices*).\n- 🥣 **Classic Egusi Soup with Bitterleaf:** ~₦9,800 for 4 servings (*hand-peeled egusi, palm oil, smoked fish, ponmo, ground crayfish*).\n- 🥬 **Efo Riro (Rich Yoruba Spinach Soup):** ~₦8,400 for 4 servings (*fresh shoko/tete, iru woro, dry fish, peppers*).\n\nEach recipe includes video walkthroughs and a 1-click price estimation based on ${loc.area || loc.lga}!`,
        timestamp: 'Just now',
        suggestedActions: [
          { label: 'Explore Recipe Hub', tab: 'recipe' },
          { label: 'Check Tomato Prices', tab: 'market' }
        ],
        sources: ['SABI Culinary Calculator', 'Mile 12 & Bodija Commodity Index']
      };
    }

    // Default intelligent conversational fallback
    return {
      id: `sabo_${Date.now()}`,
      sender: 'sabo',
      text: `**Sabo AI Answer for: "${userQuestion}"**\n\nAt SABI Nigeria, our mission is to ensure every citizen has access to **verified truth** regarding local food prices, public developments, and viral rumors across all 36 states and the FCT.\n\n- **To check verified prices:** Visit the **Market** tab for live updates on rice, tomatoes, oil, and garri.\n- **To report suspicious broadcasts:** Click **Snap Rumor / Report** to upload screenshots or audio for AI & community review.\n- **To chat with other members:** Jump into **The Sabiers** group chat.\n\nFeel free to ask me about specific Nigerian food commodities, how to earn SABI points, or recent verified facts!`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Ask About Rice & Tomato Prices', query: 'What are current rice and tomato prices?' },
        { label: 'How do I earn Stat Points?', query: 'How do I earn stat points?' },
        { label: 'Join The Sabiers Group Chat', tab: 'sabiers' }
      ],
      sources: ['SABI Knowledge Base', 'Community Verifiers']
    };
  }
}
