import type { ResultType, TruthResult } from '../types';
import { storageService } from './storageService';

export interface ConsensusComment {
  id: string;
  rumorId: string;
  userName: string;
  userRole: string;
  userAvatar?: string;
  streetLocation: string;
  vote: 'TRUE' | 'FALSE' | 'NEUTRAL';
  comment: string;
  timestamp: string;
  state?: string;
  lga?: string;
}

export interface ConsensusRecord {
  rumorId: string;
  trueVotes: number;
  falseVotes: number;
  totalVotes: number;
  consensusStatus: 'PENDING' | 'TRUE' | 'FALSE';
  requiredVotesForAutoVerdict: number;
  comments: ConsensusComment[];
}

const STORAGE_KEY = 'sabi_rumor_consensus_records';

// Initial seeded comments with street locations to demonstrate 4-6 initial verifications
const INITIAL_CONSENSUS_RECORDS: Record<string, ConsensusRecord> = {
  truth_001: {
    rumorId: 'truth_001',
    trueVotes: 0,
    falseVotes: 7,
    totalVotes: 7,
    consensusStatus: 'PENDING',
    requiredVotesForAutoVerdict: 8,
    comments: [
      {
        id: 'c1_001',
        rumorId: 'truth_001',
        userName: 'Suleiman Ibrahim',
        userRole: 'Community Verifier',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Dei-Dei Wholesale Market Gate, Abuja',
        vote: 'FALSE',
        comment: 'I am standing at Gate 2 Dei-Dei right now. Royal Stallion is ₦106,000. Nobody is selling foreign rice at ₦90,000.',
        timestamp: '15 mins ago',
        state: 'Abuja (FCT)',
        lga: 'Abuja Municipal'
      },
      {
        id: 'c2_001',
        rumorId: 'truth_001',
        userName: 'Grace Danjuma',
        userRole: 'Market Spotter',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Grain Line 4, Dei-Dei Market, Abuja',
        vote: 'FALSE',
        comment: 'Checked receipts from 3 different stores here. Caprice 50kg is ₦105,000. ₦90,000 is fake video caption.',
        timestamp: '32 mins ago',
        state: 'Abuja (FCT)',
        lga: 'Abuja Municipal'
      },
      {
        id: 'c3_001',
        rumorId: 'truth_001',
        userName: 'Usman Garba',
        userRole: 'Local Trader',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Customs Checkpoint Road, Dei-Dei, Abuja',
        vote: 'FALSE',
        comment: 'Only Nigerian local short grain is selling near ₦92,000. Foreign parboiled remains above 104k.',
        timestamp: '1 hour ago',
        state: 'Abuja (FCT)',
        lga: 'Abuja Municipal'
      },
      {
        id: 'c4_001',
        rumorId: 'truth_001',
        userName: 'Amina Bello',
        userRole: 'Truth Sentinel',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Kubwa Expressway Junction, Dei-Dei, Abuja',
        vote: 'FALSE',
        comment: 'Buyers rushing here based on TikTok clip are leaving disappointed. Prices haven’t crashed.',
        timestamp: '2 hours ago',
        state: 'Abuja (FCT)',
        lga: 'Abuja Municipal'
      },
      {
        id: 'c5_001',
        rumorId: 'truth_001',
        userName: 'Chidi Okafor',
        userRole: 'Verified Spotter',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Perishable Section, Dei-Dei, Abuja',
        vote: 'FALSE',
        comment: 'Fake news created by TikTok clip from March 2024. Market prices remain 104,000 to 107,000 Naira.',
        timestamp: '3 hours ago',
        state: 'Abuja (FCT)',
        lga: 'Abuja Municipal'
      },
      {
        id: 'c6_001',
        rumorId: 'truth_001',
        userName: 'Bello Kabiru',
        userRole: 'Field Verifier',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Dei-Dei Main Bus Stop, Abuja',
        vote: 'FALSE',
        comment: 'Just spoke with union chairman at Dei-Dei. No customs waiver or price drop occurred.',
        timestamp: '4 hours ago',
        state: 'Abuja (FCT)',
        lga: 'Abuja Municipal'
      },
      {
        id: 'c7_001',
        rumorId: 'truth_001',
        userName: 'Fatima Sanusi',
        userRole: 'Pioneer Spotter',
        userAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Zuba-Gwagwalada Link, Abuja',
        vote: 'FALSE',
        comment: 'Confirmed with 4 retailers. Foreign rice is ₦104,000. Need 1 more verification vote to auto-mark as FALSE!',
        timestamp: '5 hours ago',
        state: 'Abuja (FCT)',
        lga: 'Abuja Municipal'
      }
    ]
  },

  truth_002: {
    rumorId: 'truth_002',
    trueVotes: 0,
    falseVotes: 6,
    totalVotes: 6,
    consensusStatus: 'PENDING',
    requiredVotesForAutoVerdict: 8,
    comments: [
      {
        id: 'c1_002',
        rumorId: 'truth_002',
        userName: 'Tunde Bakare',
        userRole: 'Street Verifier',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Herbert Macaulay Way, Yaba, Lagos',
        vote: 'FALSE',
        comment: 'I am walking along Herbert Macaulay Way right now. Total station and NNPC are dispensing smoothly at ₦895/L. Zero queues!',
        timestamp: '10 mins ago',
        state: 'Lagos',
        lga: 'Lagos Mainland'
      },
      {
        id: 'c2_002',
        rumorId: 'truth_002',
        userName: 'Blessing Adebayo',
        userRole: 'Yaba Resident Spotter',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Commercial Avenue Junction, Yaba, Lagos',
        vote: 'FALSE',
        comment: 'That viral Twitter video shows a concert billboard from May 2024. It is old recycled media to cause panic buying.',
        timestamp: '25 mins ago',
        state: 'Lagos',
        lga: 'Lagos Mainland'
      },
      {
        id: 'c3_002',
        rumorId: 'truth_002',
        userName: 'Kelechi Egwu',
        userRole: 'Transport Sentinel',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Murtala Muhammed Way, Yaba, Lagos',
        vote: 'FALSE',
        comment: 'Buses are loading normal at Sabo Yaba park. Petrol is available at standard prices everywhere in Yaba.',
        timestamp: '45 mins ago',
        state: 'Lagos',
        lga: 'Lagos Mainland'
      },
      {
        id: 'c4_002',
        rumorId: 'truth_002',
        userName: 'Funke Akindele',
        userRole: 'Community Verifier',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Unilag Road, Yaba, Lagos',
        vote: 'FALSE',
        comment: 'No queue at all near Yaba Tech or Akoka. Do not fall for the viral video.',
        timestamp: '1 hour ago',
        state: 'Lagos',
        lga: 'Lagos Mainland'
      },
      {
        id: 'c5_002',
        rumorId: 'truth_002',
        userName: 'David Adeleke',
        userRole: 'Truth Sentinel',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Sabo Market Road, Yaba, Lagos',
        vote: 'FALSE',
        comment: 'Fuel price is 895 Naira. Video is outdated.',
        timestamp: '2 hours ago',
        state: 'Lagos',
        lga: 'Lagos Mainland'
      },
      {
        id: 'c6_002',
        rumorId: 'truth_002',
        userName: 'Yetunde Oladipo',
        userRole: 'Field Spotter',
        userAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Tejuosho Ultra Modern Market, Yaba, Lagos',
        vote: 'FALSE',
        comment: 'Live check confirms road is clear and fuel stations are open.',
        timestamp: '3 hours ago',
        state: 'Lagos',
        lga: 'Lagos Mainland'
      }
    ]
  },

  truth_003: {
    rumorId: 'truth_003',
    trueVotes: 7,
    falseVotes: 0,
    totalVotes: 7,
    consensusStatus: 'PENDING',
    requiredVotesForAutoVerdict: 8,
    comments: [
      {
        id: 'c1_003',
        rumorId: 'truth_003',
        userName: 'Rilwan Olayinka',
        userRole: 'Bodija Market Verifier',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Bodija Market Perishable Bay, Ibadan',
        vote: 'TRUE',
        comment: 'TRUE! 14 heavy trailers arrived from Kano at 4 AM today. Large tomato baskets dropped to ₦25,000 - ₦28,000!',
        timestamp: '5 mins ago',
        state: 'Oyo',
        lga: 'Ibadan North'
      },
      {
        id: 'c2_003',
        rumorId: 'truth_003',
        userName: 'Folake Adeyemi',
        userRole: 'Food Price Sentinel',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Bodija Vegetable Line, Ibadan',
        vote: 'TRUE',
        comment: 'Confirmed! I bought a full paint bucket measure of fresh tomatoes for ₦2,000 this morning. Supply is massive.',
        timestamp: '20 mins ago',
        state: 'Oyo',
        lga: 'Ibadan North'
      },
      {
        id: 'c3_003',
        rumorId: 'truth_003',
        userName: 'Taofeek Busari',
        userRole: 'Local Trader',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Secretariat Road entrance, Bodija, Ibadan',
        vote: 'TRUE',
        comment: 'Price is truly 25,000 to 30,000 Naira per basket due to Kano trailer influx.',
        timestamp: '40 mins ago',
        state: 'Oyo',
        lga: 'Ibadan North'
      },
      {
        id: 'c4_003',
        rumorId: 'truth_003',
        userName: 'Rasheedat Alimi',
        userRole: 'Pioneer Spotter',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Bodija Market Gate 1, Ibadan',
        vote: 'TRUE',
        comment: 'Very true report. Need 1 more verification vote to auto-verify this as TRUE!',
        timestamp: '1 hour ago',
        state: 'Oyo',
        lga: 'Ibadan North'
      },
      {
        id: 'c5_003',
        rumorId: 'truth_003',
        userName: 'Sikiru Ladoja',
        userRole: 'Market Reporter',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Bodija Abattoir Road, Ibadan',
        vote: 'TRUE',
        comment: 'Fresh produce abundance today. Baskets selling at 25k.',
        timestamp: '2 hours ago',
        state: 'Oyo',
        lga: 'Ibadan North'
      },
      {
        id: 'c6_003',
        rumorId: 'truth_003',
        userName: 'Bose Ogundipe',
        userRole: 'Truth Sentinel',
        userAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'Bodija Flyover Bay, Ibadan',
        vote: 'TRUE',
        comment: 'Verified with receipts. 25,000 Naira per basket.',
        timestamp: '3 hours ago',
        state: 'Oyo',
        lga: 'Ibadan North'
      },
      {
        id: 'c7_003',
        rumorId: 'truth_003',
        userName: 'Akeem Ajimobi',
        userRole: 'Market Verifier',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        streetLocation: 'University Road, Ibadan',
        vote: 'TRUE',
        comment: 'Multiple buyers confirmed ₦25k basket prices.',
        timestamp: '4 hours ago',
        state: 'Oyo',
        lga: 'Ibadan North'
      }
    ]
  }
};

class ConsensusVerificationService {
  private records: Record<string, ConsensusRecord> = {};
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.records = JSON.parse(raw);
      } catch {
        this.records = INITIAL_CONSENSUS_RECORDS;
      }
    } else {
      this.records = INITIAL_CONSENSUS_RECORDS;
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getRecord(rumorId: string): ConsensusRecord {
    if (!this.records[rumorId]) {
      this.records[rumorId] = {
        rumorId,
        trueVotes: 0,
        falseVotes: 0,
        totalVotes: 0,
        consensusStatus: 'PENDING',
        requiredVotesForAutoVerdict: 8,
        comments: []
      };
      this.save();
    }
    return this.records[rumorId];
  }

  /**
   * Adds a user comment and vote for a specific rumor.
   * If trueVotes or falseVotes reaches 8 (or threshold >= 8),
   * AUTOMATICALLY flips the official truth result in storageService to TRUE or FALSE!
   */
  public addVerificationComment(data: {
    rumorId: string;
    userName: string;
    userRole?: string;
    streetLocation: string;
    vote: 'TRUE' | 'FALSE' | 'NEUTRAL';
    comment: string;
    state?: string;
    lga?: string;
  }): { record: ConsensusRecord; verdictTriggered?: ResultType; message: string } {
    const record = this.getRecord(data.rumorId);

    const newComment: ConsensusComment = {
      id: 'comm_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 4),
      rumorId: data.rumorId,
      userName: data.userName || 'Community Spotter',
      userRole: data.userRole || 'Field Verifier',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      streetLocation: data.streetLocation || 'Local Street Location',
      vote: data.vote,
      comment: data.comment,
      timestamp: 'Just now',
      state: data.state || 'Lagos',
      lga: data.lga || 'Ikeja'
    };

    record.comments.unshift(newComment);

    if (data.vote === 'TRUE') {
      record.trueVotes += 1;
    } else if (data.vote === 'FALSE') {
      record.falseVotes += 1;
    }

    record.totalVotes = record.comments.filter(c => c.vote === 'TRUE' || c.vote === 'FALSE').length;

    let verdictTriggered: ResultType | undefined = undefined;
    let message = `Thank you! Your verification comment for ${data.streetLocation} was submitted (+25 PTS).`;

    // CONSENSUS AUTOMATIC VERDICT RULE:
    // If at least 8 people vote TRUE -> Auto-mark rumor as TRUE!
    // If at least 8 people vote FALSE -> Auto-mark rumor as FALSE!
    if (record.trueVotes >= 8 && record.consensusStatus !== 'TRUE') {
      record.consensusStatus = 'TRUE';
      verdictTriggered = 'TRUE';
      message = `🎉 CONSENSUS REACHED! 8 Spotters verified this rumor as TRUE on ${data.streetLocation}. Status updated to TRUE! (+100 PTS Bonus)`;
      
      // Update official truth result in storageService
      this.updateOfficialTruthResult(data.rumorId, 'TRUE', data.streetLocation, record);
    } else if (record.falseVotes >= 8 && record.consensusStatus !== 'FALSE') {
      record.consensusStatus = 'FALSE';
      verdictTriggered = 'FALSE';
      message = `🎉 CONSENSUS REACHED! 8 Spotters debunked this rumor as FALSE on ${data.streetLocation}. Status updated to FALSE! (+100 PTS Bonus)`;

      // Update official truth result in storageService
      this.updateOfficialTruthResult(data.rumorId, 'FALSE', data.streetLocation, record);
    } else {
      const remaining = Math.max(8 - Math.max(record.trueVotes, record.falseVotes), 1);
      message = `Verification recorded! ${Math.max(record.trueVotes, record.falseVotes)}/8 spotter votes received (${remaining} more needed for instant consensus badge).`;
    }

    this.records[data.rumorId] = record;
    this.save();

    // Award user points in storageService
    storageService.addPoints(25, `Submitted street verification comment at ${data.streetLocation}`);

    this.notify();
    return { record, verdictTriggered, message };
  }

  private updateOfficialTruthResult(rumorId: string, verdict: ResultType, street: string, record: ConsensusRecord) {
    const truthResults = storageService.getTruthResults();
    const existing = truthResults.find(t => t.id === rumorId);

    if (existing) {
      const updated: TruthResult = {
        ...existing,
        result: verdict,
        availableEvidenceQuote: `Verified by 8+ on-ground community spotters at ${street}. Consensus verdict confirmed as ${verdict}.`,
        contributorCount: record.totalVotes + 1,
        verifiedAt: 'Just now (Consensus Verdict)'
      };
      storageService.updateTruthResult(updated);
    }
  }

  public getAllRecords(): Record<string, ConsensusRecord> {
    return this.records;
  }
}

export const consensusVerificationService = new ConsensusVerificationService();
