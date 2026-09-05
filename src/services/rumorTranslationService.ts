import { TruthResult, VerificationTask, ResultType, AppLanguage } from '../types';
import { languageService } from './languageService';

export interface LocalizedRumorContent {
  claim: string;
  originalClaimQuote: string;
  availableEvidenceQuote: string;
  rumorSummary: string;
  whatHappened: string;
  whatBroughtAboutIt: string;
  rumorClaimsList: string[];
  audioNarrationText?: string;
}

// Handcrafted exact translations for major seeded rumors across English, Yoruba, Igbo, Hausa, Pidgin
export const RUMOR_TRANSLATIONS: Record<string, Record<AppLanguage, LocalizedRumorContent>> = {
  truth_001: {
    english: {
      claim: 'Rice Price in Dei-Dei Market crashed to ₦90,000 per 50kg bag',
      originalClaimQuote: 'Foreign parboiled rice 50kg bag crashed to ₦90,000 today in Dei-Dei Market Abuja after massive border container clearances.',
      availableEvidenceQuote: 'Three on-ground community verifiers and receipt checks confirmed foreign parboiled rice sells between ₦104,000 and ₦107,000. Only local unprocessed rice sells around ₦92,000.',
      rumorSummary: 'Viral TikTok and WhatsApp audio claiming 50kg foreign parboiled rice dropped drastically to ₦90,000 following an alleged emergency customs waiver in Abuja.',
      whatHappened: 'Foreign parboiled rice (Royal Stallion, Caprice, Mama Gold) is actively selling across Dei-Dei Market at wholesale prices between ₦104,000 and ₦107,000 per 50kg bag. Local Nigerian short-grain rice is trading at ₦92,000. Normal trading is occurring with standard stock volumes and no emergency discounting.',
      whatBroughtAboutIt: 'The rumor originated when an anonymous food deal aggregator on TikTok clipped an old broadcast from March 2024 discussing proposed temporary food tariffs. The creator added sensationalized captions claiming a ₦90,000 crash. The clip was forwarded across multiple Abuja neighborhood WhatsApp groups, causing buyers to flood stores asking for nonexistent discounts.',
      rumorClaimsList: [
        'Claimed foreign 50kg parboiled rice (Royal Stallion, Caprice) sells at ₦90,000 flat.',
        'Claimed customs opened land borders releasing 500 subsidized food trailers into Dei-Dei.',
        'Claimed retailers are mandated to sell local short grain rice at ₦65,000.'
      ],
      audioNarrationText: 'SABI Verification: Social media claims that 50kg foreign rice crashed to 90,000 Naira in Dei-Dei Market are FALSE. Community verifiers at the market confirmed prices remain between 104,000 and 107,000 Naira.'
    },
    yoruba: {
      claim: 'Iye owó ìrẹsì ní Ọjà Dei-Dei wálẹ̀ sí ₦90,000 fún àpò 50kg',
      originalClaimQuote: 'Àpò ìrẹsì àjèjì 50kg wálẹ̀ sí ₦90,000 lónìí ní Ọjà Dei-Dei ní Àbújá lẹ́yìn tí wọ́n tú àwọn àpòti ààlà sílẹ̀.',
      availableEvidenceQuote: 'Àwọn olùṣàyẹ̀wò mẹ́ta lórí ilẹ̀ àti ẹ̀rí ìwé owó fìdí ẹ̀ múlẹ̀ pé ìrẹsì àjèjì ń tà láàárín ₦104,000 sí ₦107,000. Ìrẹsì àbínibí lásán ló ń tà ní nǹkan bí ₦92,000.',
      rumorSummary: 'Àtẹ̀jáde lórí TikTok àti ohùn WhatsApp tí ń sọ pé ìrẹsì àjèjì 50kg ti wálẹ̀ sí ₦90,000 nítorí àṣẹ àwọn àṣọ́bodè ní Àbújá.',
      whatHappened: 'Ìrẹsì àjèjì (Royal Stallion, Caprice, Mama Gold) ṣì ń tà ní Ọjà Dei-Dei láàárín ₦104,000 sí ₦107,000 fún àpò 50kg. Ìrẹsì orílẹ̀-èdè Nàìjíríà ń tà ní ₦92,000. Ọjà ń lọ létòlétò láìsí ẹ̀dínwó pàjáwìrì kankan.',
      whatBroughtAboutIt: 'Orísun ìròyìn yìí jẹ́ fídíò àtijọ́ láti oṣù Kẹta ọdún 2024 tí ẹnìkan gbé jáde lórí TikTok pẹ̀lú àkọlé irọ́ láti fa àfiyèsí. Wọ́n pín in kiri lórí WhatsApp ní Àbújá, èyí sì mú kí àwọn ènìyàn sáré lọ sí ọjà láti béèrè fún ẹ̀dínwó tí kò sí.',
      rumorClaimsList: [
        'Wọ́n sọ pé àpò ìrẹsì àjèjì 50kg ń tà ní ₦90,000 gbáko.',
        'Wọ́n sọ pé àwọn àṣọ́bodè ti tú ọgọ́rọ̀ọ̀rún ọkọ̀ akẹ́rù tí ó ní oúnjẹ sílẹ̀ sí Dei-Dei.',
        'Wọ́n sọ pé wọ́n ti pàṣẹ pé kí wọ́n ta ìrẹsì ilẹ̀ wa ní ₦65,000.'
      ],
      audioNarrationText: 'Ìfìdímúlẹ̀ SABI: Ọ̀rọ̀ tí ń jà ràn-ìn lórí ayélujára pé ìrẹsì 50kg wálẹ̀ sí ₦90,000 ní Ọjà Dei-Dei jẹ́ IRỌ́ PÁTÁPÁTÁ. Iye owó gidi ṣì wà láàárín ₦104,000 sí ₦107,000.'
    },
    igbo: {
      claim: 'Ọnụ ahịa osikapa na Dei-Dei Market dara ruo ₦90,000 maka akpa 50kg',
      originalClaimQuote: 'Akpa osikapa mba ọzọ 50kg dara ruo ₦90,000 taa na Ahịa Dei-Dei Abuja mgbe a kwụsịrị ụtụ isi na oke ala.',
      availableEvidenceQuote: 'Ndị nyocha obodo atọ nọ n’ahịa na akwụkwọ ọnụ ahịa gosiri na osikapa mba ọzọ na-ere n’etiti ₦104,000 na ₦107,000. Naanị osikapa ime obodo na-ere ihe dịka ₦92,000.',
      rumorSummary: 'Ozi vidiyo TikTok na ozi olu WhatsApp na-ekwu na osikapa 50kg dara na mberede ruo ₦90,000 n’ihi iwu ụlọ ọrụ kọstọm na Abuja.',
      whatHappened: 'Osikapa mba ọzọ ka na-ere na Dei-Dei Market n’etiti ₦104,000 na ₦107,000 maka akpa 50kg. Osikapa Naijiria na-ere ₦92,000. Azụmahịa na-aga n’ihu n’ụzọ nkịtị na-enweghị mbelata pụrụ iche.',
      whatBroughtAboutIt: 'Akụkọ a sitere na vidiyo ochie nke Machị 2024 nke mmadụ biputere na TikTok na-etinye okwu ụgha iji dọta uche ndị mmadụ. E kesara ya na otu WhatsApp dị iche iche na Abuja.',
      rumorClaimsList: [
        'E kwuru na akpa osikapa 50kg mba ọzọ na-ere ₦90,000 kpọmkwem.',
        'E kwuru na kọstọm mepere oke ala bunye ụgbọ ala 500 nri na Dei-Dei.',
        'E kwuru na a manyere ndị ahịa ire osikapa ime obodo na ₦65,000.'
      ],
      audioNarrationText: 'Nkwenye SABI: Ozi na-ekwu na osikapa 50kg dara ruo ₦90,000 na Ahịa Dei-Dei bụ ỤGHA. Ndị nyocha nọ n’ahịa gosiri na ọnụ ya ka dị n’etiti ₦104,000 na ₦107,000.'
    },
    hausa: {
      claim: 'Farashin buhun shinkafa 50kg a Kasuwar Dei-Dei ya sauka zuwa ₦90,000',
      originalClaimQuote: 'Buhun shinkafar waje 50kg ya sauka zuwa ₦90,000 a yau a Kasuwar Dei-Dei dake Abuja bayan bude iyakokin kasa.',
      availableEvidenceQuote: 'Masu tabbatarwa na SABI su 3 tare da binciken rasit sun tabbatar da cewa shinkafar waje na sayarwa tsakanin ₦104,000 zuwa ₦107,000. Shinkafar gida ce kadai ke kusan ₦92,000.',
      rumorSummary: 'Bidiyon TikTok da sakon muryar WhatsApp da ke ikirarin cewa buhun shinkafa 50kg ya sauka sosai zuwa ₦90,000 a Abuja.',
      whatHappened: 'Shinkafar waje (Royal Stallion, Caprice) na ci gaba da sayarwa a Kasuwar Dei-Dei akan ₦104,000 zuwa ₦107,000. Shinkafar gida kuma ₦92,000. Ciniki na tafiya yadda ya kamata ba tare da wani ragi na musamman ba.',
      whatBroughtAboutIt: 'Wannan jita-jitar ta fito ne daga wani tsohon bidiyo na watan Maris 2024 wanda aka canza masa taken rubutu a TikTok don yaudarar mutane, aka kuma raba shi a kungiyoyin WhatsApp a Abuja.',
      rumorClaimsList: [
        'An yi ikirarin cewa shinkafar waje 50kg na sayarwa akan ₦90,000 cif.',
        'An ce kwastam ta bude iyakoki ta shigo da tireloli 500 na abinci cikin Dei-Dei.',
        'An ce an umurci yan kasuwa su sayar da shinkafar gida akan ₦65,000.'
      ],
      audioNarrationText: 'Tabbatarwar SABI: Jita-jitar da ke cewa shinkafa 50kg ta sauka zuwa Naira 90,000 a Kasuwar Dei-Dei KARYA CE. Farashin gaskiya yana tsakanin ₦104,000 zuwa ₦107,000.'
    },
    pidgin: {
      claim: 'Rice Price for Dei-Dei Market crash enter ₦90,000 per 50kg bag',
      originalClaimQuote: 'Foreign parboiled rice 50kg bag don crash go ₦90,000 today for Dei-Dei Market Abuja after customs clear containers for border.',
      availableEvidenceQuote: 'Three on-ground SABI spotters and receipt confirmation show say foreign rice dey sell between ₦104,000 and ₦107,000. Na only local unprocessed rice dey sell around ₦92,000.',
      rumorSummary: 'Viral TikTok and WhatsApp voice note wey dey claim say 50kg foreign rice crash enter ₦90,000 because of government emergency waiver for Abuja.',
      whatHappened: 'Foreign parboiled rice (Royal Stallion, Caprice) still dey sell across Dei-Dei Market between ₦104,000 and ₦107,000 per 50kg bag. Local rice dey sell ₦92,000. Market dey move normal with regular stock, no discount dey anywhere.',
      whatBroughtAboutIt: 'The fake gist start when one TikTok account carry old video from March 2024 put new fake caption say rice don crash to ₦90k. People forward am reach plenty Abuja WhatsApp groups wey make buyers rush market.',
      rumorClaimsList: [
        'Dem claim say 50kg foreign rice dey sell ₦90,000 flat.',
        'Dem claim say customs open border release 500 trailers of food enter Dei-Dei.',
        'Dem claim say retailers must sell local rice at ₦65,000.'
      ],
      audioNarrationText: 'SABI Verification: The social media gist say 50kg foreign rice crash to 90,000 Naira for Dei-Dei Market na COMPLETE LIE. True price still dey between 104,000 and 107,000 Naira.'
    }
  },

  truth_002: {
    english: {
      claim: 'Video showing severe fuel scarcity and ₦1,400/L queues in Yaba',
      originalClaimQuote: 'Massive vehicle queues paralyze Yaba as fuel stations hike pump price to ₦1,400 per litre.',
      availableEvidenceQuote: 'Live camera evidence and spotter checks at Herbert Macaulay Way stations show normal operations, zero waiting lines, and official pricing at ₦895/L.',
      rumorSummary: 'Circulating Twitter (X) video depicting massive vehicle gridlock and panic buying queues at filling stations in Yaba, claiming pumps jumped to ₦1,400/L.',
      whatHappened: 'Fuel stations along Herbert Macaulay Way, Commercial Avenue, and Murtala Muhammed Way in Yaba are dispensing premium motor spirit smoothly at official regulated rates (₦895/L). No queues or vehicular gridlocks exist on the corridor.',
      whatBroughtAboutIt: 'An engagement farming account on Twitter (X) reposted old footage recorded during the severe May 2024 supply disruption in Lagos. In the background of the video, a billboard advertising a May 2024 music concert is clearly visible. The uploader presented the archived video as a breaking morning event to gain retweets and panic interactions.',
      rumorClaimsList: [
        'Claimed all major fuel marketers along Herbert Macaulay Way closed pumps.',
        'Claimed remaining independent filling stations are charging ₦1,400 per litre.',
        'Claimed vehicle queues have shut down interstate transport from Yaba.'
      ],
      audioNarrationText: 'SABI Media Check: The viral video depicting long queues in Yaba is OUTDATED MEDIA. Analysis confirms the footage dates back to May 2024. Current stations in Yaba are operating normally.'
    },
    yoruba: {
      claim: 'Fídíò tí ń fi àìsí epo rọ̀bì tó lágbára àti ìlà ₦1,400/L hàn ní Yaba',
      originalClaimQuote: 'Ìlà ọkọ̀ tó pọ̀ ti da ìrìn-àjò rú ní Yaba bí àwọn ilé-epo ṣe gbé owó lórí sí ₦1,400 fún lítà kan.',
      availableEvidenceQuote: 'Àwọn kámẹ́rà tààrà àti àwọn olùṣàyẹ̀wò ní Herbert Macaulay Way fìdí rẹ̀ múlẹ̀ pé epo ń lọ dáadáa láìsí ìlà kankan ní iye ₦895/L.',
      rumorSummary: 'Fídíò lórí Twitter (X) tí ń sọ pé ọkọ̀ kò lè rìn mọ́ ní àwọn ilé-epo ní Yaba àti pé epo ti di ₦1,400 fún lítà kan.',
      whatHappened: 'Àwọn ilé-epo ní Herbert Macaulay Way, Commercial Avenue, àti Murtala Muhammed Way ní Yaba ń ta epo láìsí wàhálà ní iye owó tó tọ́ (₦895/L). Kò sí ìlà ọkọ̀ kankan níbẹ̀.',
      whatBroughtAboutIt: 'Ẹnìkan lórí Twitter (X) tún fídíò àtijọ́ ti oṣù Karùn-ún ọdún 2024 gbé jáde. Ní ẹ̀yìn fídíò náà, pátákó ìpolówó orin ti May 2024 hàn kedere. Ẹni náà gbé e jáde bí ìròyìn tòní láti fi dẹ́rùbà àwọn ènìyàn.',
      rumorClaimsList: [
        'Wọ́n sọ pé gbogbo ilé-epo pàtàkì ní Herbert Macaulay ti ti ilẹ̀kùn.',
        'Wọ́n sọ pé àwọn ilé-epo kéékèèké ń ta epo ní ₦1,400 fún lítà kan.',
        'Wọ́n sọ pé ìlà ọkọ̀ ti dá gbogbo ọkọ̀ ìrìn-àjò dúró ní Yaba.'
      ],
      audioNarrationText: 'Ìṣàyẹ̀wò SABI: Fídíò tí ń fi ìlà gígùn hàn ní Yaba jẹ́ FÍDÍÒ ÀTIJỌ́. Ìwádìí fi hàn pé fídíò náà jẹ́ ti May 2024. Àwọn ilé-epo ní Yaba ń ṣiṣẹ́ dáadáa lónìí.'
    },
    igbo: {
      claim: 'Vidiyo na-egosi ụkọ mmanụ ụgbọala na ahịrị ₦1,400/L na Yaba',
      originalClaimQuote: 'Ahịrị ụgbọ ala buru ibu mebiri njem na Yaba ka ụlọ ọrụ mmanụ mụbara ọnụ ahịa ruo ₦1,400 kwa lita.',
      availableEvidenceQuote: 'Foto igwefoto na nlele ndị nyocha na Herbert Macaulay Way gosiri na mmanụ na-ere nke ọma na-enweghị ahịrị na ọnụ ahịa ₦895/L.',
      rumorSummary: 'Vidiyo Twitter (X) na-egosi ụgbọ ala juru ebe niile na Yaba na-ekwu na mmanụ erutela ₦1,400 kwa lita.',
      whatHappened: 'Ụlọ ọrụ mmanụ niile dị na Herbert Macaulay Way na Murtala Muhammed Way na Yaba na-ere mmanụ nke ọma na ₦895/L na-enweghị ahịrị ọ bụla.',
      whatBroughtAboutIt: 'Otu onye na Twitter (X) biputere vidiyo ochie nke ọnwa Mee 2024. N’azụ vidiyo ahụ, a na-ahụ bọọdụ mgbasa ozi nke Mee 2024 nke ọma. O mere ya ka ndị mmadụ nwee ụjọ.',
      rumorClaimsList: [
        'E kwuru na ụlọ mmanụ niile dị na Herbert Macaulay mechiri.',
        'E kwuru na ụlọ mmanụ ndị ọzọ na-ere ₦1,400 kwa lita.',
        'E kwuru na ahịrị ụgbọ ala kwụsịrị njem niile si Yaba pụọ.'
      ],
      audioNarrationText: 'Nlele Mgbasa Ozi SABI: Vidiyo ahụ na-egosi ahịrị ogologo na Yaba bụ VIDIYO OCHIE. Nnyocha gosiri na ọ bụ nke Mee 2024. Ụlọ mmanụ dị na Yaba na-arụ ọrụ nke ọma taa.'
    },
    hausa: {
      claim: 'Bidiyon da ke nuna karancin man fetur da layin ₦1,400/L a Yaba',
      originalClaimQuote: 'Dogon layin motoci ya kawo cunkoso a Yaba yayin da gidajen mai suka kara farashin lita zuwa ₦1,400.',
      availableEvidenceQuote: 'Kyamarori da binciken masu lura na SABI a Herbert Macaulay Way sun nuna gidajen mai na aiki lafiya ba layi a kan ₦895/L.',
      rumorSummary: 'Bidiyon Twitter (X) da ke nuna cunkoson motoci da tsoro a gidajen mai a Yaba, yana ikirarin man ya kai ₦1,400 kan kowace lita.',
      whatHappened: 'Gidajen mai da ke Herbert Macaulay Way da Commercial Avenue a Yaba suna sayar da man fetur cikin sauki akan farashin gwamnati (₦895/L) ba tare da layi ba.',
      whatBroughtAboutIt: 'Wani a Twitter (X) ya sake yada tsohon bidiyo na watan Mayu 2024 lokacin da aka samu matsalar mai a Legas. A jikin allon talla a bidiyon, an ga tallar Mayu 2024 a fili.',
      rumorClaimsList: [
        'An ce dukkan manyan gidajen mai a Herbert Macaulay sun rufe.',
        'An ce sauran kananan gidajen mai na sayarwa a ₦1,400 kan kowace lita.',
        'An ce layin motoci ya hana motocin sufuri fita daga Yaba.'
      ],
      audioNarrationText: 'Binciken SABI: Bidiyon da ke nuna dogon layi a Yaba TSOHON BIDIYO NE na Mayu 2024. Gidajen mai na Yaba na aiki lafiya a yau.'
    },
    pidgin: {
      claim: 'Video showing heavy fuel scarcity and ₦1,400/L queue for Yaba',
      originalClaimQuote: 'Heavy motor line block Yaba road as fuel stations increase pump price to ₦1,400 per litre.',
      availableEvidenceQuote: 'Live camera evidence and spotters wey dey Herbert Macaulay Way confirm say petrol stations dey pump normal, zero line, and price na ₦895/L.',
      rumorSummary: 'Twitter (X) video wey dey show heavy traffic and panic queue for filling stations for Yaba, claiming fuel don jump to ₦1,400/L.',
      whatHappened: 'Filling stations for Herbert Macaulay Way, Commercial Avenue, and Murtala Muhammed Way for Yaba dey sell petrol smoothly at official rate (₦895/L). No queue dey at all.',
      whatBroughtAboutIt: 'One person on Twitter (X) go dig out old video from May 2024 fuel wahala for Lagos repost am today. For the background of the video, concert billboard from May 2024 dey show clear.',
      rumorClaimsList: [
        'Dem claim say major fuel stations for Herbert Macaulay don lock gate.',
        'Dem claim say independent filling stations dey charge ₦1,400 per litre.',
        'Dem claim say fuel queue don scatter transport commot from Yaba.'
      ],
      audioNarrationText: 'SABI Media Check: The viral video wey dey show long queue for Yaba na OLD RECYCLED VIDEO from May 2024. Fuel stations for Yaba dey sell normal today.'
    }
  },

  truth_003: {
    english: {
      claim: 'Tomato prices at Bodija Market dropped below ₦30,000 per basket',
      originalClaimQuote: 'Huge truck arrivals from Kano force Bodija fresh tomato basket down to ₦25,000 today.',
      availableEvidenceQuote: 'On-site market spotters confirmed fresh arrivals resulted in basket prices between ₦25,000 and ₦30,000 depending on grade.',
      rumorSummary: 'Facebook live video and audio updates reporting major price drops in fresh produce baskets at Bodija Market after 14 heavy trailers arrived overnight from Northern farms.',
      whatHappened: 'Large baskets of fresh tomatoes from Kano and Jos farms are selling between ₦25,000 and ₦30,000 at the Bodija Market perishable bay. Retail 4L paint bucket measures are also down to ₦2,000–₦2,500.',
      whatBroughtAboutIt: 'A harvest bumper crop in Northern irrigation corridors coincided with improved transport logistics, leading 14 articulated trucks to arrive simultaneously at Bodija Market at 4 AM. Traders initiated rapid discounting to clear perishable stock before the afternoon heat.',
      rumorClaimsList: [
        'Claimed large rafia baskets of fresh Jos and Kano tomatoes dropped to ₦25,000 - ₦30,000.',
        'Claimed retail 4L paint bucket portions are now selling around ₦2,000.',
        'Confirmed high inventory supply available directly at the perishable section.'
      ],
      audioNarrationText: 'SABI Verified: Reports that tomato basket prices dropped to 25,000 Naira at Bodija Market are TRUE, driven by heavy supply from Kano.'
    },
    yoruba: {
      claim: 'Iye owó agbọ̀n tòmátì ní Ọjà Bodija wálẹ̀ sí ìsàlẹ̀ ₦30,000',
      originalClaimQuote: 'Ọkọ̀ akẹ́rù ńlá láti Kano mú kí iye agbọ̀n tòmátì titun wálẹ̀ sí ₦25,000 lónìí ní Bodija.',
      availableEvidenceQuote: 'Àwọn olùṣàyẹ̀wò ọjà lórí ilẹ̀ fìdí rẹ̀ múlẹ̀ pé agbọ̀n tòmátì ń tà láàárín ₦25,000 sí ₦30,000 gẹ́gẹ́ bí dídára rẹ̀.',
      rumorSummary: 'Fídíò lórí Facebook tí ń ròyìn ẹ̀dínwó ńlá lórí agbọ̀n tòmátì ní Ọjà Bodija lẹ́yìn tí ọkọ̀ akẹ́rù 14 dé láti àwọn oko àríwá.',
      whatHappened: 'Agbọ̀n ńlá tòmátì láti Kano àti Jos ń tà láàárín ₦25,000 sí ₦30,000 ní Ọjà Bodija. Ìwọ̀n garawa pẹ́ńtì 4L sì wálẹ̀ sí ₦2,000–₦2,500.',
      whatBroughtAboutIt: 'Àkójọpọ̀ èso púpọ̀ láti àríwá pẹ̀lú dídé ọkọ̀ akẹ́rù 14 ní ago mẹ́rin òwúrọ̀ mú kí àwọn oníṣòwò dín owó kù kí tòmátì má baà bàjẹ́ nínú oòrùn.',
      rumorClaimsList: [
        'Wọ́n fìdí rẹ̀ múlẹ̀ pé agbọ̀n tòmátì titun wálẹ̀ sí ₦25,000 - ₦30,000.',
        'Wọ́n fìdí rẹ̀ múlẹ̀ pé ìwọ̀n garawa 4L ń tà ní nǹkan bí ₦2,000.',
        'Ẹrù púpọ̀ wà lárọ̀ọ́wọ́tó ní apá tòmátì ní Bodija.'
      ],
      audioNarrationText: 'Ìfìdímúlẹ̀ SABI: Ìròyìn pé iye agbọ̀n tòmátì wálẹ̀ sí ₦25,000 ní Ọjà Bodija jẹ́ ÒTÍTỌ́ PÁTÁPÁTÁ nítorí ọkọ̀ tó pọ̀ láti Kano.'
    },
    igbo: {
      claim: 'Ọnụ ahịa nkata tomato na Bodija Market dara n’okpuru ₦30,000',
      originalClaimQuote: 'Ụgbọ ala buru ibu si Kano wetara tomato mere ka nkata tomato daa ruo ₦25,000 taa na Bodija.',
      availableEvidenceQuote: 'Ndị nyocha nọ n’ahịa kwadoro na nkata tomato ọhụrụ na-ere n’etiti ₦25,000 na ₦30,000 dabere na ọkwa ya.',
      rumorSummary: 'Vidiyo Facebook na-akọ banyere mbelata ọnụ ahịa tomato na Bodija Market mgbe ụgbọ ala 14 buru ibu batara n’abalị site n’ugwu.',
      whatHappened: 'Nkata tomato buru ibu si Kano na Jos na-ere n’etiti ₦25,000 na ₦30,000 na Bodija Market. Nkezi bọket 4L na-ere ₦2,000–₦2,500.',
      whatBroughtAboutIt: 'Ọtụtụ tomato sitere n’ugwu na mbata ụgbọ ala 14 n’otu oge mere ka ndị ahịa belata ọnụ ahịa ngwa ngwa ka ọ ghara imebi.',
      rumorClaimsList: [
        'E kwadoro na nkata tomato ọhụrụ dara ruo ₦25,000 - ₦30,000.',
        'E kwadoro na bọket 4L na-ere ihe dịka ₦2,000.',
        'Enwere tomato zuru oke na ngalaba nri na Bodija.'
      ],
      audioNarrationText: 'Nkwenye SABI: Akụkọ na-ekwu na nkata tomato dara ruo ₦25,000 na Bodija Market bụ EZIOKWU n’ihi nnukwu ngwongwo si Kano bata.'
    },
    hausa: {
      claim: 'Farashin kwandon tumatir a Kasuwar Bodija ya sauka kasa da ₦30,000',
      originalClaimQuote: 'Shigowar manyan motocin tumatir daga Kano ya sa kwandon tumatir ya sauka zuwa ₦25,000 a Bodija a yau.',
      availableEvidenceQuote: 'Masu lura na SABI a kasuwa sun tabbatar da cewa kwandon tumatir na sayarwa tsakanin ₦25,000 zuwa ₦30,000.',
      rumorSummary: 'Bidiyon Facebook da ke ba da labarin saukar farashin tumatir a Kasuwar Bodija bayan motocin tirela 14 sun iso da sassafe daga Arewacin Najeriya.',
      whatHappened: 'Manyan kwando na tumatir daga Kano da Jos na sayarwa tsakanin ₦25,000 zuwa ₦30,000 a Kasuwar Bodija. Kananan robar fenti 4L kuma na sayarwa ₦2,000 zuwa ₦2,500.',
      whatBroughtAboutIt: 'Yawan girbin tumatir da shigowar tireloli 14 a lokaci guda da karfe 4 na asuba ya sa yan kasuwa suka rage farashi don kada tumatir ya lalace a rana.',
      rumorClaimsList: [
        'An tabbatar da cewa babban kwandon tumatir ya sauka zuwa ₦25,000 - ₦30,000.',
        'An tabbatar da cewa robar fenti 4L na sayarwa a kusan ₦2,000.',
        'Akwai wadataccen tumatir a sashen kayan miya a Kasuwar Bodija.'
      ],
      audioNarrationText: 'Tabbatarwar SABI: Rahotannin cewa kwandon tumatir ya sauka zuwa ₦25,000 a Kasuwar Bodija GASKIYA NE sakamakon shigo da kaya daga Kano.'
    },
    pidgin: {
      claim: 'Tomato basket price for Bodija Market drop below ₦30,000',
      originalClaimQuote: 'Heavy trailers from Kano make fresh tomato basket crash reach ₦25,000 today for Bodija.',
      availableEvidenceQuote: 'On-ground spotters for Bodija market confirm say fresh tomato basket dey sell between ₦25,000 and ₦30,000 depending on quality.',
      rumorSummary: 'Facebook live video wey dey report say tomato basket price don fall well well for Bodija Market after 14 heavy trailers arrive overnight from North.',
      whatHappened: 'Big basket of fresh tomatoes from Kano and Jos dey sell between ₦25,000 and ₦30,000 for Bodija Market. Retail 4L paint bucket measure don drop to ₦2,000–₦2,500.',
      whatBroughtAboutIt: 'Plenty harvest from Northern farms and 14 trailers wey land together by 4 AM make traders slash price sharp-sharp make e no spoil for sun.',
      rumorClaimsList: [
        'Confirmed say big basket of fresh tomato drop to ₦25,000 - ₦30,000.',
        'Confirmed say 4L paint rubber measure dey sell around ₦2,000.',
        'Supply boku well well for perishable section for Bodija.'
      ],
      audioNarrationText: 'SABI Verified: The gist say tomato basket price drop reach 25,000 Naira for Bodija Market na TRUE, because heavy supply land from Kano.'
    }
  },

  truth_004: {
    english: {
      claim: 'Rumor that Dangote Cement factory price announced at ₦5,200 nationwide',
      originalClaimQuote: 'Press release claiming factory direct cement supply at ₦5,200 per 50kg bag starting this week.',
      availableEvidenceQuote: 'Depot managers in Port Harcourt, Lagos, and Kano confirmed no price adjustment notice was issued. Retail remains ₦8,400 to ₦9,000.',
      rumorSummary: 'Circulating YouTube Shorts and WhatsApp letter claiming Dangote Industries announced an emergency factory price reduction to ₦5,200 per 50kg bag.',
      whatHappened: 'Wholesale and retail cement prices across Port Harcourt, Lagos, Abuja, and Kano remain steady at ₦8,400–₦9,000 per 50kg bag. Factory direct gates continue distributing under existing commercial price lists.',
      whatBroughtAboutIt: 'A fraudulent YouTube channel created an edited corporate flyer with a fake Dangote letterhead to drive clicks and solicit unauthorized direct payments for fictitious wholesale allocations. The fake document was screenshot and shared rapidly in builder and real estate forums.',
      rumorClaimsList: [
        'Claimed Dangote Cement issued a circular pegging ex-factory depot cost at ₦5,200.',
        'Claimed all retail building material distributors are obligated to sell at ₦5,500.',
        'Claimed port offloaders in Port Harcourt and Lagos started direct retail distribution.'
      ],
      audioNarrationText: 'SABI Alert: The circulated letter claiming Dangote Cement has reduced prices to 5,200 Naira is FALSE. No official price reduction has occurred.'
    },
    yoruba: {
      claim: 'Àhesọ̀ pé ilé-iṣẹ́ Dangote ti kéde owó sìmẹ́ǹtì ní ₦5,200 ní gbogbo orílẹ̀-èdè',
      originalClaimQuote: 'Ìwé ìròyìn tí ń sọ pé sìmẹ́ǹtì taàrà láti ilé-iṣẹ́ jẹ́ ₦5,200 fún àpò 50kg láti ọ̀sẹ̀ yìí lọ.',
      availableEvidenceQuote: 'Àwọn olùdarí ibi ìkẹ́rùsí ní Port Harcourt, Èkó, àti Kano fìdí rẹ̀ múlẹ̀ pé kò sí ìkéde kankan. Iye owó ṣì wà láàárín ₦8,400 sí ₦9,000.',
      rumorSummary: 'Fídíò lórí YouTube àti ìwé lórí WhatsApp tí ń sọ pé Dangote ti dín owó sìmẹ́ǹtì kù sí ₦5,200 fún àpò 50kg.',
      whatHappened: 'Iye owó sìmẹ́ǹtì ní Port Harcourt, Èkó, Àbújá, àti Kano ṣì wà láàárín ₦8,400 sí ₦9,000 fún àpò 50kg. Ilé-iṣẹ́ kò dín owó kù.',
      whatBroughtAboutIt: 'Àkọọ́lẹ̀ YouTube kan tó ń wá èrè ṣe àtúnṣe sí ìwé àtijọ́ pẹ̀lú orúkọ Dangote láti gba owó lọ́wọ́ àwọn ènìyàn. Wọ́n ya àwòrán rẹ̀ pín kiri lórí WhatsApp.',
      rumorClaimsList: [
        'Wọ́n sọ pé Dangote kọ ìwé pé sìmẹ́ǹtì jẹ́ ₦5,200 ní ilé-iṣẹ́.',
        'Wọ́n sọ pé gbogbo olùtajà gbọ́dọ̀ ta á ní ₦5,500.',
        'Wọ́n sọ pé wọ́n ti bẹ̀rẹ̀ sí í ta á taàrà ní Èkó àti Port Harcourt.'
      ],
      audioNarrationText: 'Ìkìlọ̀ SABI: Ìwé tí ń sọ pé Dangote Cement ti dín owó kù sí ₦5,200 jẹ́ IRỌ́ PÁTÁPÁTÁ. Kò sí ẹ̀dínwó kankan.'
    },
    igbo: {
      claim: 'Asịrị na Dangote Cement mara ọkwa ọnụ ahịa ₦5,200 na mba niile',
      originalClaimQuote: 'Akwụkwọ ozi na-ekwu na simenti sitere na fektri na-ere ₦5,200 maka akpa 50kg.',
      availableEvidenceQuote: 'Ndị njikwa depot na Port Harcourt, Lagos, na Kano kwadoro na ọ nweghị ozi dị otú ahụ. Ọnụ ya ka dị ₦8,400 ruo ₦9,000.',
      rumorSummary: 'Vidiyo YouTube na ozi WhatsApp na-ekwu na Dangote Industries belatara ọnụ ahịa simenti ruo ₦5,200 maka akpa 50kg.',
      whatHappened: 'Ọnụ ahịa simenti na Port Harcourt, Lagos, Abuja na Kano ka kwụ chịm na ₦8,400–₦9,000 maka akpa 50kg.',
      whatBroughtAboutIt: 'Ọwa YouTube mepụtara akwụkwọ ụgha nwere akara Dangote iji nweta nlele na iduhie ndị mmadụ.',
      rumorClaimsList: [
        'E kwuru na Dangote nyere iwu ire simenti na ₦5,200.',
        'E kwuru na a manyere ndị ahịa ire na ₦5,500.',
        'E kwuru na mbubata simenti amalitela na Port Harcourt na Lagos.'
      ],
      audioNarrationText: 'Ịdọ Aka ná Ntị SABI: Akwụkwọ ozi na-ekwu na Dangote Cement belatara ọnụ ahịa ruo ₦5,200 bụ ỤGHA. Ọnụ ahịa ya agbanwebeghị.'
    },
    hausa: {
      claim: 'Jita-jitar cewa kamfanin Dangote ya rage farashin siminti zuwa ₦5,200 a fadin kasar',
      originalClaimQuote: 'Wata sanarwa da ke ikirarin cewa farashin buhun siminti 50kg ya koma ₦5,200 daga masana\'anta.',
      availableEvidenceQuote: 'Manajojin ma\'ajiyar siminti a Fatakwal, Legas da Kano sun tabbatar da cewa ba a fitar da wata sanarwar rage farashi ba. Farashin na tsakanin ₦8,400 zuwa ₦9,000.',
      rumorSummary: 'Gajeren bidiyon YouTube da takardar WhatsApp da ke ikirarin kamfanin Dangote ya rage farashin siminti zuwa ₦5,200 kan kowane buhu.',
      whatHappened: 'Farashin siminti a Fatakwal, Legas, Abuja da Kano yana nan a tsakanin ₦8,400 zuwa ₦9,000 kan kowane buhu 50kg.',
      whatBroughtAboutIt: 'Wani a YouTube ya kera takardar jabu dauke da tambarin Dangote don yaudarar mutane su tura masa kudi.',
      rumorClaimsList: [
        'An ce kamfanin Dangote ya rage farashi zuwa ₦5,200.',
        'An ce dole ne dukkan yan kasuwa su sayar a ₦5,500.',
        'An ce an fara sayarwa kai tsaye a Fatakwal da Legas.'
      ],
      audioNarrationText: 'Fadakarwar SABI: Takardar da ke ikirarin Dangote Cement ya rage farashi zuwa ₦5,200 KARYA CE. Farashin bai sauka ba.'
    },
    pidgin: {
      claim: 'Rumor say Dangote Cement factory price don drop to ₦5,200 nationwide',
      originalClaimQuote: 'Letter wey dey circulate claim say factory price of cement na ₦5,200 per 50kg bag starting this week.',
      availableEvidenceQuote: 'Depot managers for Port Harcourt, Lagos, and Kano confirm say no price change memo. Retail price still dey between ₦8,400 and ₦9,000.',
      rumorSummary: 'YouTube Shorts and WhatsApp fake letter claiming Dangote Industries announce emergency reduction of cement to ₦5,200 per 50kg bag.',
      whatHappened: 'Wholesale and retail cement price across Port Harcourt, Lagos, Abuja, and Kano still dey stable at ₦8,400–₦9,000 per 50kg bag.',
      whatBroughtAboutIt: 'One fake YouTube channel create fake letterhead with Dangote logo to scam people make dem pay for fake supply.',
      rumorClaimsList: [
        'Dem claim say Dangote Cement issue memo say factory price na ₦5,200.',
        'Dem claim say all building material stores must sell ₦5,500.',
        'Dem claim say direct port offload don start for Port Harcourt and Lagos.'
      ],
      audioNarrationText: 'SABI Alert: The letter wey dey claim say Dangote Cement drop to 5,200 Naira na COMPLETE FAKE NEWS. Price still dey normal.'
    }
  },

  truth_005: {
    english: {
      claim: 'Second Niger Bridge closed to interstate transport for urgent repairs',
      originalClaimQuote: 'Urgent advisory: Second Niger Bridge closed until Monday morning for expansion joint maintenance.',
      availableEvidenceQuote: 'Community verifiers on-site captured live video showing open toll corridors and continuous vehicle flow with no construction barriers.',
      rumorSummary: 'Viral TikTok broadcast claiming the Second Niger Bridge connecting Asaba and Onitsha was shut down indefinitely by the Ministry of Works for emergency repairs.',
      whatHappened: 'The Second Niger Bridge toll link and expressway bypass between Asaba (Delta) and Onitsha (Anambra) are fully open to all commercial and private vehicles with smooth traffic flow.',
      whatBroughtAboutIt: 'A routine 15-minute roadside sweeping and line-marking operation conducted early in the morning by road maintenance personnel was misconstrued by a passerby who recorded a 10-second TikTok clip shouting that the bridge had been shut down.',
      rumorClaimsList: [
        'Claimed toll plazas and expressway bypass were blocked with concrete barricades.',
        'Claimed commercial buses were diverted back to the old Niger Bridge.',
        'Claimed joint expansion repairs will take 3 weeks to complete.'
      ],
      audioNarrationText: 'SABI Verification: The Second Niger Bridge remains open and accessible. Reports of bridge closure are completely FALSE.'
    },
    yoruba: {
      claim: 'Wọ́n ti ti Afárá Kejì lórí Odò Ọya fún àtúnṣe pàjáwìrì',
      originalClaimQuote: 'Ìkìlọ̀ pàjáwìrì: Wọ́n ti ti Afárá Kejì títí di owúrọ̀ Ọjọ́ Ajé fún àtúnṣe.',
      availableEvidenceQuote: 'Àwọn olùṣàyẹ̀wò ọ̀rọ̀ lórí ilẹ̀ ya fídíò tààrà tó fi hàn pé ọkọ̀ ń kọjá láìsí ìdènà kankan.',
      rumorSummary: 'Fídíò TikTok tí ń sọ pé Ilé-iṣẹ́ Ìjọba ti ti Afárá Kejì tó so Asaba àti Onitsha pọ̀ fún àtúnṣe.',
      whatHappened: 'Afárá Kejì láàárín Asaba (Delta) àti Onitsha (Anambra) wà ní ṣíṣí sílẹ̀ fún gbogbo ọkọ̀ pẹ̀lú ìrìn-àjò tó rọrùn.',
      whatBroughtAboutIt: 'Iṣẹ́ ìmúlélòdé kékeré tí àwọn òṣìṣẹ́ ṣe lẹ́gbẹ̀ẹ́ títì ní owúrọ̀ kùtùkùtù ni ẹnìkan gbé jáde lórí TikTok pé wọ́n ti ti afárá náà.',
      rumorClaimsList: [
        'Wọ́n sọ pé wọ́n ti fi pákó ìdènà dí ojú ọ̀nà.',
        'Wọ́n sọ pé gbogbo ọkọ̀ ni wọ́n darí padà sí afárá àtijọ́.',
        'Wọ́n sọ pé àtúnṣe náà yóò gba ọ̀sẹ̀ mẹ́ta.'
      ],
      audioNarrationText: 'Ìfìdímúlẹ̀ SABI: Afárá Kejì Odò Ọya wà ní ṣíṣí sílẹ̀. Ìròyìn pé wọ́n ti afárá jẹ́ IRỌ́ PÁTÁPÁTÁ.'
    },
    igbo: {
      claim: 'E mechiri Second Niger Bridge maka nrụzi mberede',
      originalClaimQuote: 'Ịdọ aka ná ntị: E mechiri Second Niger Bridge ruo ụtụtụ Mọnde maka nrụzi.',
      availableEvidenceQuote: 'Ndị nyocha obodo nọ n’ebe ahụ weere vidiyo na-egosi na okporo ụzọ mepere emepe na ụgbọ ala na-agafe nke ọma.',
      rumorSummary: 'Vidiyo TikTok na-ekwu na Ministry of Works mechiri Second Niger Bridge jikọtara Asaba na Onitsha maka nrụzi mberede.',
      whatHappened: 'Second Niger Bridge dị n’etiti Asaba (Delta) na Onitsha (Anambra) mepere emepe maka ụgbọ ala niile na-enweghị nsogbu ọ bụla.',
      whatBroughtAboutIt: 'Obere ọrụ nhicha okporo ụzọ nke were nkeji 15 n’ụtụtụ ka otu onye hụrụ were vidiyo TikTok kwuo na e mechiri akwa mmiri ahụ.',
      rumorClaimsList: [
        'E kwuru na e ji ihe mgbochi mechie okporo ụzọ niile.',
        'E kwuru na a kpọghachiri ụgbọ ala niile n’akwa ochie Niger.',
        'E kwuru na nrụzi ahụ ga-ewe izu atọ.'
      ],
      audioNarrationText: 'Nkwenye SABI: Second Niger Bridge mepere emepe maka njem. Akụkọ na-ekwu na e mechiri ya bụ ỤGHA.'
    },
    hausa: {
      claim: 'An rufe Sabon Gadar Neja (Second Niger Bridge) don gyaran gaggawa',
      originalClaimQuote: 'Sanarwar gaggawa: An rufe Sabon Gadar Neja har zuwa safiyar Litinin don yin gyare-gyare.',
      availableEvidenceQuote: 'Masu tabbatarwa na SABI sun dauki bidiyo kai tsaye da ke nuna motoci na wucewa lafiya babu wani shinge.',
      rumorSummary: 'Bidiyon TikTok da ke ikirarin Ma\'aikatar Ayyuka ta rufe Sabon Gadar Neja tsakanin Asaba da Onitsha don gyara.',
      whatHappened: 'Sabon Gadar Neja tsakanin Asaba (Delta) da Onitsha (Anambra) a bude yake ga dukkan motocin kasuwanci da na kashin kai.',
      whatBroughtAboutIt: 'Dan karamin aikin share hanya na minti 15 da safe wani ya gani ya dauki bidiyon TikTok yana cewa an rufe gadar.',
      rumorClaimsList: [
        'An ce an sa simintin shinge an rufe titin.',
        'An ce an mayar da dukkan motoci tsohon gadar Neja.',
        'An ce gyaran zai dauki makonni 3.'
      ],
      audioNarrationText: 'Tabbatarwar SABI: Sabon Gadar Neja a bude yake. Labarin cewa an rufe gadar KARYA CE.'
    },
    pidgin: {
      claim: 'Second Niger Bridge close for interstate transport for urgent repairs',
      originalClaimQuote: 'Urgent notice: Second Niger Bridge don close till Monday morning for repair work.',
      availableEvidenceQuote: 'Community spotters for the bridge show live video say expressway open clear and motors dey pass normal with zero blockage.',
      rumorSummary: 'Viral TikTok video claiming Ministry of Works don lock Second Niger Bridge wey link Asaba and Onitsha for emergency repairs.',
      whatHappened: 'The Second Niger Bridge between Asaba (Delta) and Onitsha (Anambra) dey 100% open to all motors with free-flow traffic.',
      whatBroughtAboutIt: 'Small 15-minute road sweeping wey workers do for morning na him one person record for TikTok shout say bridge don lock.',
      rumorClaimsList: [
        'Dem claim say concrete barrier dey block the expressway.',
        'Dem claim say dem divert all buses go old Niger Bridge.',
        'Dem claim say repair work go take 3 weeks.'
      ],
      audioNarrationText: 'SABI Verification: Second Niger Bridge dey open and clear. The gist say dem close bridge na COMPLETE LIE.'
    }
  },

  truth_006: {
    english: {
      claim: 'UK Home Office Abolishes Health and Care Worker Visa Sponsorship for Africans',
      originalClaimQuote: 'Viral broadcast stating the UK Government has banned all health worker applications from Africa effective immediately.',
      availableEvidenceQuote: 'UK Home Office published official immigration rules showing visa routes remain active with updated salary thresholds and certified sponsor requirements.',
      rumorSummary: 'Twitter (X) viral thread alleging the UK Home Office has completely halted and banned all health and social care worker visa sponsorships originating from Africa.',
      whatHappened: 'The UK Health and Care Worker visa route remains actively open for qualified applicants globally, subject to standard CQC registration and updated sponsorship salary rules. No nationality-based or continental ban exists.',
      whatBroughtAboutIt: 'A panic-inducing thread on Twitter (X) took changes restricting dependents for certain social care workers and exaggerated them into an outright ban on African healthcare personnel. The thread went viral across diaspora migration discussion groups.',
      rumorClaimsList: [
        'Claimed complete ban on NHS and care home Certificates of Sponsorship (CoS) for Africans.',
        'Claimed pending visa applications at TLScontact and VFS centres were automatically cancelled.',
        'Claimed immediate deportation order for existing carers.'
      ],
      audioNarrationText: 'SABI Fact Check: Claims that the UK has banned African health worker visas are FALSE. Standard visa sponsorships remain open globally.'
    },
    yoruba: {
      claim: 'Ìjọba UK ti fòpin sí fisa fún àwọn òṣìṣẹ́ ìlera láti Áfíríkà',
      originalClaimQuote: 'Ìròyìn tí ń sọ pé Ìjọba UK ti fagilé gbogbo fisa fún àwọn òṣìṣẹ́ ìlera láti Áfíríkà lẹ́sẹ̀kẹsẹ̀.',
      availableEvidenceQuote: 'Òfin ìṣiṣẹ́ UK fi hàn kedere pé ọ̀nà fisa ṣì wà ní ṣíṣí fún gbogbo àwọn tó bá kúnjú òwọ̀n.',
      rumorSummary: 'Àtẹ̀jáde lórí Twitter (X) tí ń sọ pé Ìjọba UK kò gba àwọn òṣìṣẹ́ ìlera láti Áfíríkà mọ́.',
      whatHappened: 'Fisa fún àwọn òṣìṣẹ́ ìlera ní UK ṣì wà ní ṣíṣí fún àwọn tí wọ́n lẹ́tọ̀ọ́ láti gbogbo àgbáyé. Kò sí ìdènà kankan lórí orílẹ̀-èdè Áfíríkà.',
      whatBroughtAboutIt: 'Àtúnṣe kékeré lórí mímú ìdílé wá ni ẹnìkan gbé jáde lórí Twitter (X) tó sì sọ ọ́ di ìròyìn irọ́ pé wọ́n ti fòpin sí fisa náà pátápátá.',
      rumorClaimsList: [
        'Wọ́n sọ pé wọ́n ti dá Certificate of Sponsorship (CoS) dúró fún àwọn ará Áfíríkà.',
        'Wọ́n sọ pé wọ́n ti fagilé àwọn ìwé tí wọ́n fi ránṣẹ́ ní TLScontact.',
        'Wọ́n sọ pé wọ́n fẹ́ lé àwọn olùtọ́jú tó wà níbẹ̀ jáde.'
      ],
      audioNarrationText: 'Ìṣàyẹ̀wò SABI: Ọ̀rọ̀ pé UK ti fòpin sí fisa àwọn òṣìṣẹ́ ìlera láti Áfíríkà jẹ́ IRỌ́. Ọ̀nà fisa ṣì wà ní ṣíṣí fún gbogbo ènìyàn.'
    },
    igbo: {
      claim: 'UK Home Office akwụsịla inye ndị Africa visa ndị ọrụ nlekọta ahụike',
      originalClaimQuote: 'Ozi na-ekwu na Gọọmenti UK amachibidola ngwa niile sitere n’Afrịka maka ndị ọrụ ahụike ozugbo.',
      availableEvidenceQuote: 'Iwu mbata UK gosiri na ụzọ visa ka na-emeghe maka ndị ruru eru n’ụwa niile.',
      rumorSummary: 'Ozi Twitter (X) na-ekwu na UK Home Office akwụsịla kpamkpam inye ndị Afrịka visa nlekọta ahụike.',
      whatHappened: 'Ụzọ visa Health and Care Worker na UK ka mepere emepe maka ndị niile ruru eru n’ụwa niile. Enweghị mmachibido iwu megide ndị Afrịka.',
      whatBroughtAboutIt: 'Mgbanwe gbasara ịkpọbata ndị ezinụlọ ka e mere ka ọ dị ka amachibidola ndị Afrịka niile.',
      rumorClaimsList: [
        'E kwuru na a kwụsịrị Certificates of Sponsorship (CoS) maka ndị Afrịka.',
        'E kwuru na a kagburu akwụkwọ visa niile dị na TLScontact.',
        'E kwuru na a ga-achụpụ ndị ọrụ nlekọta niile nọ na UK ugbu a.'
      ],
      audioNarrationText: 'Nlele SABI: Ozi na-ekwu na UK amachibidola visa ndị ọrụ ahụike Afrịka bụ ỤGHA. Ụzọ visa ka mepere emepe.'
    },
    hausa: {
      claim: 'Kasar Birtaniya (UK) ta soke bayar da bizar aikin kula da lafiya ga yan Afirka',
      originalClaimQuote: 'Wani sako da ke cewa Gwamnatin Birtaniya ta dakatar da dukkan neman bizar aikin lafiya daga Afirka nan take.',
      availableEvidenceQuote: 'Dokokin shige da fice na UK sun nuna cewa bizar aikin lafiya a bude take ga duk wanda ya cancanta a duniya.',
      rumorSummary: 'Labarin Twitter (X) da ke ikirarin cewa UK ta dakatar da daukar ma\'aikatan lafiya daga kasashen Afirka gaba daya.',
      whatHappened: 'Bizar Health and Care Worker a UK tana nan a bude ga duk wanda ya cika ka\'idoji a fadin duniya ba tare da nuna wariyar yanki ko kasa ba.',
      whatBroughtAboutIt: 'Canje-canjen da aka yi kan hana ma\'aikata tahowa da iyalansu ne aka karkatar da shi zuwa cewa an dakatar da yan Afirka gaba daya.',
      rumorClaimsList: [
        'An ce an dakatar da Certificate of Sponsorship (CoS) ga yan Afirka.',
        'An ce an soke dukkan takardun neman biza a TLScontact.',
        'An ce za a koro dukkan ma\'aikatan lafiya dake UK a yanzu.'
      ],
      audioNarrationText: 'Binciken SABI: Ikirarin cewa UK ta hana yan Afirka bizar aikin lafiya KARYA CE. Hanyar biza a bude take.'
    },
    pidgin: {
      claim: 'UK Home Office cancel Health and Care Worker Visa for Africans',
      originalClaimQuote: 'Viral broadcast claim say UK Government don ban all health worker applications from Africa immediately.',
      availableEvidenceQuote: 'UK Home Office official immigration rules show say visa pathway still open for qualified people all over the world.',
      rumorSummary: 'Twitter (X) viral thread alleging say UK Home Office don completely stop and ban all care worker visa for Africans.',
      whatHappened: 'The UK Health and Care Worker visa route still 100% open for qualified applicants worldwide. No country or Africa ban exist anywhere.',
      whatBroughtAboutIt: 'Small policy update wey say care workers no fit bring family na him one Twitter account twist turn am to outright ban on Africans.',
      rumorClaimsList: [
        'Dem claim say no more Certificates of Sponsorship (CoS) for Africans.',
        'Dem claim say pending visa applications for TLScontact don cancel.',
        'Dem claim say dem wan deport current care workers.'
      ],
      audioNarrationText: 'SABI Fact Check: The claim say UK ban African health workers visa na COMPLETE LIE. Visa route still dey open.'
    }
  }
};

// Social media today rumors localized dictionaries
export const SOCIAL_RUMORS_LOCALIZED: Record<string, Record<AppLanguage, { claim: string; evidenceSummary: string; location: string }>> = {
  rumor_insta_today_1: {
    english: {
      claim: 'Viral Instagram Reels alleging CBN issued new ₦5,000 banknote with portrait changes',
      evidenceSummary: 'CBN spokesperson confirmed no new currency denominations have been printed or authorized in 2026.',
      location: 'Lagos & Abuja'
    },
    yoruba: {
      claim: 'Fídíò Instagram tí ń sọ pé Ilé Ìfowópamọ́ Àpapọ̀ CBN ti tẹ owó ₦5,000 tuntun jáde',
      evidenceSummary: 'Agbẹnusọ CBN fìdí rẹ̀ múlẹ̀ pé kò sí owó tuntun kankan tí wọ́n tẹ̀ jáde ní ọdún 2026.',
      location: 'Èkó àti Àbújá'
    },
    igbo: {
      claim: 'Vidiyo Instagram na-ekwu na CBN ewepụtala ego ₦5,000 ọhụrụ nwere foto dị iche',
      evidenceSummary: 'Ọnụ na-ekwuru CBN kwadoro na enweghị ego ọhụrụ e bipụtara na 2026.',
      location: 'Lagos na Abuja'
    },
    hausa: {
      claim: 'Bidiyon Instagram da ke ikirarin CBN ta fitar da sabon kudin ₦5,000 mai sabon hoto',
      evidenceSummary: 'Kakakin CBN ya tabbatar da cewa ba a buga wani sabon kudi ba a shekarar 2026.',
      location: 'Legas da Abuja'
    },
    pidgin: {
      claim: 'Viral Instagram Reels wey claim say CBN don release new ₦5,000 note with new face',
      evidenceSummary: 'CBN spokesperson confirm say no new naira note dem print or approve in 2026.',
      location: 'Lagos & Abuja'
    }
  },

  rumor_tiktok_today_2: {
    english: {
      claim: 'TikTok video claiming 50kg bag of foreign rice crashed to ₦32,000 in Bodija Market, Ibadan',
      evidenceSummary: 'On-ground SABI spotters verified prevailing 50kg rice is ₦78,000 - ₦84,000 across Ibadan markets.',
      location: 'Bodija, Oyo State'
    },
    yoruba: {
      claim: 'Fídíò TikTok tí ń sọ pé àpò ìrẹsì àjèjì 50kg ti wálẹ̀ sí ₦32,000 ní Ọjà Bodija, Ìbàdàn',
      evidenceSummary: 'Àwọn olùṣàyẹ̀wò SABI lórí ilẹ̀ fìdí rẹ̀ múlẹ̀ pé ìrẹsì 50kg ń tà ní ₦78,000 - ₦84,000 ní Ìbàdàn.',
      location: 'Bodija, Ìpínlẹ̀ Ọ̀yọ́'
    },
    igbo: {
      claim: 'Vidiyo TikTok na-ekwu na akpa osikapa 50kg dara ruo ₦32,000 na Bodija Market, Ibadan',
      evidenceSummary: 'Ndị nyocha SABI nọ n’ahịa gosiri na osikapa 50kg na-ere ₦78,000 - ₦84,000 na Ibadan.',
      location: 'Bodija, Oyo State'
    },
    hausa: {
      claim: 'Bidiyon TikTok da ke cewa buhun shinkafar waje 50kg ya sauka zuwa ₦32,000 a Kasuwar Bodija, Ibadan',
      evidenceSummary: 'Masu lura na SABI a kasuwa sun tabbatar da cewa buhun shinkafa 50kg yana kan ₦78,000 - ₦84,000.',
      location: 'Bodija, Jihar Oyo'
    },
    pidgin: {
      claim: 'TikTok video claiming 50kg bag of foreign rice crash enter ₦32,000 for Bodija Market, Ibadan',
      evidenceSummary: 'On-ground SABI spotters verify say true 50kg rice price na ₦78,000 - ₦84,000 for Ibadan markets.',
      location: 'Bodija, Oyo State'
    }
  },

  rumor_twitter_today_3: {
    english: {
      claim: 'Trending X (Twitter) claim that Third Mainland Bridge is closed today due to structural repairs',
      evidenceSummary: 'Lagos State Ministry of Works and LASTMA confirmed bridge is fully open with smooth traffic flow.',
      location: 'Lagos Mainland'
    },
    yoruba: {
      claim: 'Àhesọ̀ lórí X (Twitter) pé wọ́n ti ti Afárá Kẹta ti Èkó (Third Mainland Bridge) lónìí fún àtúnṣe',
      evidenceSummary: 'Ilé-iṣẹ́ Ìjọba Èkó àti LASTMA fìdí rẹ̀ múlẹ̀ pé afárá náà wà ní ṣíṣí pẹ̀lú ìrìn-àjò tó dán mọ́ran.',
      location: 'Mainland, Èkó'
    },
    igbo: {
      claim: 'Ozi Twitter (X) na-ekwu na e mechiri Third Mainland Bridge taa maka nrụzi',
      evidenceSummary: 'Ministry of Works na LASTMA na Lagos kwadoro na akwa mmiri ahụ mepere emepe maka njem.',
      location: 'Lagos Mainland'
    },
    hausa: {
      claim: 'Labarin Twitter (X) da ke cewa an rufe gadar Third Mainland Bridge a yau don gyare-gyare',
      evidenceSummary: 'Ma\'aikatar ayyuka ta jihar Legas da LASTMA sun tabbatar da cewa gadar a bude take ga ababen hawa.',
      location: 'Lagos Mainland'
    },
    pidgin: {
      claim: 'Trending X (Twitter) claim say Third Mainland Bridge lock today because of repair work',
      evidenceSummary: 'Lagos State Ministry of Works and LASTMA confirm say bridge dey 100% open with smooth traffic.',
      location: 'Lagos Mainland'
    }
  },

  rumor_youtube_today_4: {
    english: {
      claim: 'YouTube documentary alleging massive chemical contamination in Kano tomato puree harvests',
      evidenceSummary: 'NAFDAC statement confirms video is recycled footage from a 2019 pesticide inspection case.',
      location: 'Kano & Kaduna'
    },
    yoruba: {
      claim: 'Fídíò YouTube tí ń sọ pé májèlé kẹ́míkà wà nínú tòmátì Kano',
      evidenceSummary: 'Àtẹ̀jáde NAFDAC fìdí rẹ̀ múlẹ̀ pé fídíò àtijọ́ ti ọdún 2019 ni wọ́n tún gbé jáde.',
      location: 'Kano àti Kaduna'
    },
    igbo: {
      claim: 'Vidiyo YouTube na-ekwu na enwere kemịkalụ na-egbu egbu na tomato Kano',
      evidenceSummary: 'NAFDAC kwadoro na vidiyo ahụ bụ nke ochie sitere na nyocha nke afọ 2019.',
      location: 'Kano na Kaduna'
    },
    hausa: {
      claim: 'Bidiyon YouTube da ke ikirarin akwai sinadarai masu guba a cikin tumatir a Kano',
      evidenceSummary: 'Hukumar NAFDAC ta tabbatar da cewa tsohon bidiyo ne na shekarar 2019 aka sake yadawa.',
      location: 'Kano da Kaduna'
    },
    pidgin: {
      claim: 'YouTube video claiming say chemical poison dey inside Kano fresh tomato harvest',
      evidenceSummary: 'NAFDAC statement confirm say na recycled old video from 2019 inspection.',
      location: 'Kano & Kaduna'
    }
  },

  rumor_tiktok_today_5: {
    english: {
      claim: 'TikTok audio memo claiming NNPC raised petrol pump price to ₦1,500/liter in Port Harcourt',
      evidenceSummary: 'NNPC retail outlets in PH and Rivers state are dispensing at official standard pump prices.',
      location: 'Port Harcourt, Rivers'
    },
    yoruba: {
      claim: 'Ohùn TikTok tí ń sọ pé NNPC ti gbé owó epo sókè sí ₦1,500 fún lítà kan ní Port Harcourt',
      evidenceSummary: 'Àwọn ilé-epo NNPC ní Port Harcourt àti Ìpínlẹ̀ Rivers ń ta epo ní iye owó tó tọ́.',
      location: 'Port Harcourt, Rivers'
    },
    igbo: {
      claim: 'Ozi olu TikTok na-ekwu na NNPC mụbara ọnụ ahịa mmanụ ruo ₦1,500/lita na Port Harcourt',
      evidenceSummary: 'Ụlọ ọrụ NNPC dị na Rivers State na-ere mmanụ na ọnụ ahịa gọọmentị kwadoro.',
      location: 'Port Harcourt, Rivers'
    },
    hausa: {
      claim: 'Sakon muryar TikTok da ke cewa NNPC ta kara farashin man fetur zuwa ₦1,500 kan kowace lita a Fatakwal',
      evidenceSummary: 'Gidajen mai na NNPC a Fatakwal da Jihar Rivers na sayar da mai a farashin gwamnati.',
      location: 'Port Harcourt, Rivers'
    },
    pidgin: {
      claim: 'TikTok audio voice note claiming NNPC increase petrol price to ₦1,500/litre for Port Harcourt',
      evidenceSummary: 'NNPC filling stations for PH and Rivers state dey sell at official normal pump price.',
      location: 'Port Harcourt, Rivers'
    }
  },

  rumor_insta_today_6: {
    english: {
      claim: 'Instagram post showing free Federal Government educational tablets distributed to secondary students',
      evidenceSummary: 'Federal Ministry of Education pilot initiative is ongoing in select pilot schools; full rollout pending.',
      location: 'Abuja & Nationwide'
    },
    yoruba: {
      claim: 'Àtẹ̀jáde Instagram tí ń fi ẹ̀rọ kọ̀ǹpútà tábùlẹ́tì tí Ìjọba Àpapọ̀ ń pín fún àwọn akẹ́kọ̀ọ́ hàn',
      evidenceSummary: 'Ètò ìdánwò Ilé-iṣẹ́ Ẹ̀kọ́ Àpapọ̀ ń lọ lọ́wọ́ ní àwọn ilé-ìwé díẹ̀ tí a yàn.',
      location: 'Àbújá àti Gbobo Nàìjíríà'
    },
    igbo: {
      claim: 'Ozi Instagram na-egosi kọmputa tablet Gọọmenti etiti na-ekesa n’efu nye ụmụ akwụkwọ',
      evidenceSummary: 'Atụmatụ nyocha nke Ministry of Education na-aga n’ihu n’ụlọ akwụkwọ ole na ole a họọrọ.',
      location: 'Abuja na Mba Niile'
    },
    hausa: {
      claim: 'Sakon Instagram da ke nuna allunan kwamfuta (tablets) kyauta da Gwamnatin Tarayya ke rabawa dalibai',
      evidenceSummary: 'Shirin gwaji na Ma\'aikatar Ilimi ta Kasa yana gudana a wasu zababbun makarantu.',
      location: 'Abuja da Kasa Baki Daya'
    },
    pidgin: {
      claim: 'Instagram post showing free Federal Government learning tablets wey dem dey share for secondary schools',
      evidenceSummary: 'Federal Ministry of Education pilot project dey ongoing for few selected schools; full sharing never start.',
      location: 'Abuja & Nationwide'
    }
  }
};

export const VERDICT_TRANSLATIONS: Record<ResultType, Record<AppLanguage, { label: string; subLabel: string }>> = {
  'TRUE': {
    english: { label: 'CONFIRMED TRUTH', subLabel: 'Verified by On-Ground Spotters' },
    yoruba: { label: 'ÒTÍTỌ́ GIDI', subLabel: 'Àwọn Olùṣàyẹ̀wò Fìdí Ẹ̀ Múlẹ̀' },
    igbo: { label: 'EZIOKWU EKWADORO', subLabel: 'Ndị Nyocha Obodo Kwadoro Ya' },
    hausa: { label: 'TABBATAR DA GASKIYA', subLabel: 'Masu Lura Sun Tabbatar' },
    pidgin: { label: 'CONFIRMED TRUTH', subLabel: 'On-Ground Spotters Confirm Am' }
  },
  'FALSE': {
    english: { label: 'CONFIRMED FAKE', subLabel: 'Debunked Misinformation' },
    yoruba: { label: 'IRỌ́ PÁTÁPÁTÁ', subLabel: 'Ìròyìn Èké Tí A Tú Àṣírí Rẹ̀' },
    igbo: { label: 'ỤGHA E KWADORO', subLabel: 'Akụkọ Ụgha Agbaghara Ya' },
    hausa: { label: 'KARYA CE', subLabel: 'Karyata Labarin Karya' },
    pidgin: { label: 'CONFIRMED FAKE NEWS', subLabel: 'Complete Lie / Debunked' }
  },
  'OUTDATED MEDIA': {
    english: { label: 'OUTDATED MEDIA', subLabel: 'Recycled Historical Footage' },
    yoruba: { label: 'FÍDÍÒ / ÀWÒRÁN ÀTIJỌ́', subLabel: 'Àtijọ́ Tí Wọ́n Tún Gbé Jáde' },
    igbo: { label: 'VIDIYO / FOTO OCHIE', subLabel: 'Ihe Ochie E Kesara Ọzọ' },
    hausa: { label: 'TSOHON BIDIYO / LABARI', subLabel: 'Tsohon Kayan Da Aka Maimaita' },
    pidgin: { label: 'OUTDATED MEDIA', subLabel: 'Old Recycled Video / Audio' }
  },
  'UNVERIFIED': {
    english: { label: 'UNVERIFIED', subLabel: 'Under Investigation' },
    yoruba: { label: 'A KÒ TÍÌ FÌDÍ Ẹ̀ MÚLẸ̀', subLabel: 'Wọ́n Ṣì Ń Ṣèwádìí Rẹ̀' },
    igbo: { label: 'EKWADOBEGHỊ YA', subLabel: 'A Ka Na-enyocha Ya' },
    hausa: { label: 'BA A TABBATAR BA', subLabel: 'Ana Kan Bincike' },
    pidgin: { label: 'UNVERIFIED', subLabel: 'We Still Dey Investigate' }
  },
  'NEEDS MORE VERIFICATION': {
    english: { label: 'NEEDS MORE EVIDENCE', subLabel: 'Spotter Reports Required' },
    yoruba: { label: 'NÍLÒ Ẹ̀RÍ SÍ I', subLabel: 'A Ní Lò Olùṣàyẹ̀wò Lórí Ilẹ̀' },
    igbo: { label: 'CHỌRỌ NKWENYE ỌZỌ', subLabel: 'Achọrọ Ndị Nyocha Obodo' },
    hausa: { label: 'YANA BUKATAR KARIN SHAIDA', subLabel: 'Ana Bukatar Karatun Masu Lura' },
    pidgin: { label: 'NEEDS MORE VERIFICATION', subLabel: 'We Need More Spotters for Ground' }
  }
};

class RumorTranslationService {
  /**
   * Translates a TruthResult into the desired target language.
   * If an exact handcrafted localization exists, uses it;
   * otherwise, dynamically translates key phrases and claims into the target language.
   */
  public localizeTruthResult(result: TruthResult, lang?: AppLanguage): TruthResult {
    const targetLang = lang || languageService.getLanguage();
    if (targetLang === 'english') {
      return result;
    }

    const itemDict = RUMOR_TRANSLATIONS[result.id]?.[targetLang];
    if (itemDict) {
      return {
        ...result,
        claim: itemDict.claim || result.claim,
        originalClaimQuote: itemDict.originalClaimQuote || result.originalClaimQuote,
        availableEvidenceQuote: itemDict.availableEvidenceQuote || result.availableEvidenceQuote,
        rumorSummary: itemDict.rumorSummary || result.rumorSummary,
        whatHappened: itemDict.whatHappened || result.whatHappened,
        whatBroughtAboutIt: itemDict.whatBroughtAboutIt || result.whatBroughtAboutIt,
        rumorClaimsList: itemDict.rumorClaimsList || result.rumorClaimsList,
        audioNarrationText: itemDict.audioNarrationText || result.audioNarrationText
      };
    }

    // Dynamic smart translation for custom or dynamically generated rumors
    return {
      ...result,
      claim: this.translateGenericSentence(result.claim, targetLang),
      originalClaimQuote: this.translateGenericSentence(result.originalClaimQuote, targetLang),
      availableEvidenceQuote: this.translateGenericSentence(result.availableEvidenceQuote, targetLang),
      rumorSummary: result.rumorSummary ? this.translateGenericSentence(result.rumorSummary, targetLang) : undefined,
      whatHappened: result.whatHappened ? this.translateGenericSentence(result.whatHappened, targetLang) : undefined,
      whatBroughtAboutIt: result.whatBroughtAboutIt ? this.translateGenericSentence(result.whatBroughtAboutIt, targetLang) : undefined,
      rumorClaimsList: result.rumorClaimsList?.map(c => this.translateGenericSentence(c, targetLang)) || result.rumorClaimsList
    };
  }

  public localizeTruthResults(results: TruthResult[], lang?: AppLanguage): TruthResult[] {
    const targetLang = lang || languageService.getLanguage();
    return results.map(r => this.localizeTruthResult(r, targetLang));
  }

  public localizeClaim(claimText: string, lang?: AppLanguage): string {
    const targetLang = lang || languageService.getLanguage();
    if (targetLang === 'english') return claimText;

    // Check if any known rumor matches this claim
    for (const id in RUMOR_TRANSLATIONS) {
      const entry = RUMOR_TRANSLATIONS[id];
      if (entry.english.claim === claimText) {
        return entry[targetLang]?.claim || claimText;
      }
    }

    // Check social rumors
    for (const id in SOCIAL_RUMORS_LOCALIZED) {
      const entry = SOCIAL_RUMORS_LOCALIZED[id];
      if (entry.english.claim === claimText) {
        return entry[targetLang]?.claim || claimText;
      }
    }

    return this.translateGenericSentence(claimText, targetLang);
  }

  public localizeSocialRumor(rumor: any, lang?: AppLanguage): any {
    const targetLang = lang || languageService.getLanguage();
    if (targetLang === 'english') return rumor;

    const entry = SOCIAL_RUMORS_LOCALIZED[rumor.id]?.[targetLang];
    if (entry) {
      return {
        ...rumor,
        claim: entry.claim || rumor.claim,
        evidenceSummary: entry.evidenceSummary || rumor.evidenceSummary,
        location: entry.location || rumor.location
      };
    }

    return {
      ...rumor,
      claim: this.translateGenericSentence(rumor.claim, targetLang),
      evidenceSummary: rumor.evidenceSummary ? this.translateGenericSentence(rumor.evidenceSummary, targetLang) : rumor.evidenceSummary
    };
  }

  public localizeSocialRumors(rumors: any[], lang?: AppLanguage): any[] {
    const targetLang = lang || languageService.getLanguage();
    return rumors.map(r => this.localizeSocialRumor(r, targetLang));
  }

  public getLocalizedVerdict(result: ResultType, lang?: AppLanguage): { label: string; subLabel: string } {
    const targetLang = lang || languageService.getLanguage();
    return VERDICT_TRANSLATIONS[result]?.[targetLang] || VERDICT_TRANSLATIONS[result]?.english || { label: result, subLabel: '' };
  }

  /**
   * Intelligently translates arbitrary dynamic rumor phrases into Nigerian languages
   */
  private translateGenericSentence(text: string, lang: AppLanguage): string {
    if (!text || lang === 'english') return text;

    let res = text;

    if (lang === 'yoruba') {
      res = res
        .replace(/crashed to/gi, 'wálẹ̀ sí')
        .replace(/price drop|price crashed/gi, 'ẹ̀dínwó owó')
        .replace(/bag of rice/gi, 'àpò ìrẹsì')
        .replace(/foreign rice/gi, 'ìrẹsì àjèjì')
        .replace(/fuel scarcity/gi, 'àìsí epo rọ̀bì')
        .replace(/filling station/gi, 'ilé-epo')
        .replace(/per litre/gi, 'fún lítà kan')
        .replace(/market/gi, 'ọjà')
        .replace(/tomato basket/gi, 'agbọ̀n tòmátì')
        .replace(/closed/gi, 'ti pa')
        .replace(/bridge/gi, 'afárá')
        .replace(/viral video/gi, 'fídíò lórí ayélujára')
        .replace(/viral claim|rumor/gi, 'àhesọ̀')
        .replace(/confirmed/gi, 'fìdí rẹ̀ múlẹ̀')
        .replace(/false|fake/gi, 'irọ́')
        .replace(/true/gi, 'òtítọ́');
      return res;
    }

    if (lang === 'igbo') {
      res = res
        .replace(/crashed to/gi, 'dara ruo')
        .replace(/price drop|price crashed/gi, 'mbelata ọnụ ahịa')
        .replace(/bag of rice/gi, 'akpa osikapa')
        .replace(/foreign rice/gi, 'osikapa mba ọzọ')
        .replace(/fuel scarcity/gi, 'ụkọ mmanụ')
        .replace(/filling station/gi, 'ụlọ mmanụ')
        .replace(/per litre/gi, 'kwa lita')
        .replace(/market/gi, 'ahịa')
        .replace(/tomato basket/gi, 'nkata tomato')
        .replace(/closed/gi, 'mechiri')
        .replace(/bridge/gi, 'akwa mmiri')
        .replace(/viral video/gi, 'vidiyo na-efegharị')
        .replace(/viral claim|rumor/gi, 'asịrị')
        .replace(/confirmed/gi, 'kwadoro')
        .replace(/false|fake/gi, 'ụgha')
        .replace(/true/gi, 'eziokwu');
      return res;
    }

    if (lang === 'hausa') {
      res = res
        .replace(/crashed to/gi, 'ya sauka zuwa')
        .replace(/price drop|price crashed/gi, 'saukar farashi')
        .replace(/bag of rice/gi, 'buhun shinkafa')
        .replace(/foreign rice/gi, 'shinkafar waje')
        .replace(/fuel scarcity/gi, 'karancin man fetur')
        .replace(/filling station/gi, 'gidan mai')
        .replace(/per litre/gi, 'kan kowace lita')
        .replace(/market/gi, 'kasuwa')
        .replace(/tomato basket/gi, 'kwandon tumatir')
        .replace(/closed/gi, 'an rufe')
        .replace(/bridge/gi, 'gada')
        .replace(/viral video/gi, 'bidiyon da ke yawo')
        .replace(/viral claim|rumor/gi, 'jita-jita')
        .replace(/confirmed/gi, 'an tabbatar')
        .replace(/false|fake/gi, 'karya')
        .replace(/true/gi, 'gaskiya');
      return res;
    }

    if (lang === 'pidgin') {
      res = res
        .replace(/crashed to/gi, 'crash enter')
        .replace(/price drop|price crashed/gi, 'price fall well well')
        .replace(/bag of rice/gi, 'bag of rice')
        .replace(/fuel scarcity/gi, 'fuel scarcity')
        .replace(/filling station/gi, 'filling station')
        .replace(/per litre/gi, 'per litre')
        .replace(/closed/gi, 'lock')
        .replace(/bridge/gi, 'bridge')
        .replace(/viral claim|rumor/gi, 'viral gist')
        .replace(/confirmed/gi, 'confirm')
        .replace(/false|fake/gi, 'fake news')
        .replace(/true/gi, 'true');
      return res;
    }

    return text;
  }
}

export const rumorTranslationService = new RumorTranslationService();
