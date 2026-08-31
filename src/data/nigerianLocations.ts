import { NigerianStateData } from '../types';

export const NIGERIAN_STATES: NigerianStateData[] = [
  {
    state: "FCT - Abuja",
    capital: "Abuja",
    lgas: [
      { name: "Abuja Municipal (AMAC)", majorMarkets: ["Wuse Market", "Garki Market", "Utako Market", "Maitama", "Garki 2"] },
      { name: "Bwari", majorMarkets: ["Dei-Dei Building & Food Market", "Bwari Central", "Dutse Alhaji Market", "Kubwa Market"] },
      { name: "Gwagwalada", majorMarkets: ["Gwagwalada Main Market", "University Area"] },
      { name: "Kuje", majorMarkets: ["Kuje Main Market", "Forest Reserve Junction"] },
      { name: "Kwali", majorMarkets: ["Kwali Town Market", "Yangoji"] },
      { name: "Abaji", majorMarkets: ["Abaji Main Market", "River Crossing Point"] }
    ]
  },
  {
    state: "Lagos",
    capital: "Ikeja",
    lgas: [
      { name: "Lagos Mainland", majorMarkets: ["Yaba Tejuosho Market", "Oyingbo Ultra-Modern Market", "Ebute Metta"] },
      { name: "Kosofe", majorMarkets: ["Mile 12 International Food Market", "Ketu Market", "Ojota Interchange"] },
      { name: "Ikeja", majorMarkets: ["Computer Village (Otigba)", "Ipodo Market", "Alausa Secretariat"] },
      { name: "Lagos Island", majorMarkets: ["Balogun Market", "Idumota Market", "Jankara Market", "Marina"] },
      { name: "Alimosho", majorMarkets: ["Iyana Ipaja Market", "Egbeda Market", "Ikotun Market"] },
      { name: "Ojo", majorMarkets: ["Alaba International Market", "Trade Fair Complex", "Iyana Iba"] },
      { name: "Surulere", majorMarkets: ["Ojuelegba Market", "National Stadium Area", "Aguda Market"] },
      { name: "Eti-Osa", majorMarkets: ["Lekki Phase 1 Market", "Ajah Market", "Jakande Market", "Victoria Island"] },
      { name: "Oshodi-Isolo", majorMarkets: ["Oshodi Arena", "Isolo Market", "Ajao Estate"] },
      { name: "Ikorodu", majorMarkets: ["Ikorodu Main Market (Sabo)", "Odoguyan", "Agric"] },
      { name: "Mushin", majorMarkets: ["Mushin Foodstuff Market", "Ladipo Auto Spare Parts Market"] },
      { name: "Agege", majorMarkets: ["Agege Abattoir Market", "Pen Cinema", "Sango"] }
    ]
  },
  {
    state: "Anambra",
    capital: "Awka",
    lgas: [
      { name: "Onitsha North", majorMarkets: ["Onitsha Main Market", "Ose Okwodu Food Market", "Bright Street"] },
      { name: "Onitsha South", majorMarkets: ["Relief Market", "Bridgehead Market", "Fegge"] },
      { name: "Nnewi North", majorMarkets: ["Nkwo Nnewi Auto Parts Market", "Eke Amobi"] },
      { name: "Awka South", majorMarkets: ["Eke Awka Main Market", "Aroma Junction", "Ifite"] },
      { name: "Idemili North", majorMarkets: ["Ogidi Building Material Market", "Nkpor Motor Parts"] },
      { name: "Ihiala", majorMarkets: ["Nkwo Ogbe Market", "Total Filling Station Area"] }
    ]
  },
  {
    state: "Kano",
    capital: "Kano",
    lgas: [
      { name: "Dawakin Tofa", majorMarkets: ["Dawanau International Grains Market", "Kwa Junction"] },
      { name: "Fagge", majorMarkets: ["Sabon Gari Market", "Fagge Juma'at Area", "Yankaba Food Market"] },
      { name: "Kano Municipal", majorMarkets: ["Kurmi Traditional Market", "Kasuwar Rimi", "Kofar Wambai"] },
      { name: "Nasarawa", majorMarkets: ["Singer Market", "Brigade", "Bompai Industrial Area"] },
      { name: "Gwale", majorMarkets: ["Dorayi Market", "Kabuga Gateway"] },
      { name: "Tarauni", majorMarkets: ["Gyadi-Gyadi Market", "Maiduguri Road Bypass"] }
    ]
  },
  {
    state: "Oyo",
    capital: "Ibadan",
    lgas: [
      { name: "Ibadan North", majorMarkets: ["Bodija International Market", "Sango Market", "Agodi Gate", "UI Area"] },
      { name: "Ibadan South-West", majorMarkets: ["Dugbe Central Business District", "Apata Market", "Ring Road"] },
      { name: "Ibadan South-East", majorMarkets: ["Oja'ba (King's Market)", "Molete Market", "Scada"] },
      { name: "Ibadan North-East", majorMarkets: ["Oje Herbal & Fabric Market", "Iwo Road Interchange"] },
      { name: "Ogbomosho North", majorMarkets: ["Oja Igbo", "Takie Square"] },
      { name: "Oyo East", majorMarkets: ["Oja Akesan (Alaafin Palace)", "Owode"] }
    ]
  },
  {
    state: "Rivers",
    capital: "Port Harcourt",
    lgas: [
      { name: "Port Harcourt City", majorMarkets: ["Mile 1 Market (Diobu)", "Mile 3 Food Market", "Creek Road Market", "Town"] },
      { name: "Obio-Akpor", majorMarkets: ["Oil Mill Market (Rumuokwurusi)", "Rumuokoro Interchange", "Choba Market", "Garrison"] },
      { name: "Eleme", majorMarkets: ["Eleme Junction", "Petrochemicals Gate Market"] },
      { name: "Ikwerre", majorMarkets: ["Isiokpo Market", "Airport Road Terminal"] },
      { name: "Oyigbo", majorMarkets: ["Oyigbo Main Market", "Express Junction"] }
    ]
  },
  {
    state: "Enugu",
    capital: "Enugu",
    lgas: [
      { name: "Enugu North", majorMarkets: ["Ogbete Main Market", "New Market (Artisans)", "Holy Ghost Park"] },
      { name: "Enugu South", majorMarkets: ["Kenyatta Market", "Gariki Market (Awkunanaw)"] },
      { name: "Enugu East", majorMarkets: ["Abakpa Nike Market", "Emene Industrial Market"] },
      { name: "Nsukka", majorMarkets: ["Ogige Main Market Nsukka", "UNN Campus Gate"] }
    ]
  },
  {
    state: "Kaduna",
    capital: "Kaduna",
    lgas: [
      { name: "Kaduna North", majorMarkets: ["Central Market (Sheikh Gumi)", "Kawo Market", "Badarawa"] },
      { name: "Kaduna South", majorMarkets: ["Kasuwan Barchi Market", "Television Garage Market", "Kakuri"] },
      { name: "Zaria", majorMarkets: ["Sabon Gari Zaria Market", "Tudun Wada", "Samaru ABU Gate"] }
    ]
  },
  {
    state: "Edo",
    capital: "Benin City",
    lgas: [
      { name: "Oredo", majorMarkets: ["Oba Market", "New Benin Market", "Ring Road Center", "Ekiosa Market"] },
      { name: "Ikpoba-Okha", majorMarkets: ["Ikpoba Hill Food Market", "Upper Sakponba"] },
      { name: "Egor", majorMarkets: ["Uselu Market", "UNIBEN Main Gate"] }
    ]
  },
  {
    state: "Delta",
    capital: "Asaba",
    lgas: [
      { name: "Oshimili South", majorMarkets: ["Ogbeogonogo Modern Market (Asaba)", "Cable Point"] },
      { name: "Warri South", majorMarkets: ["Main Market Warri", "Igbudu Market", "Pessu Market"] },
      { name: "Uvwie", majorMarkets: ["Effurun Market", "PTI Junction"] }
    ]
  },
  {
    state: "Akwa Ibom",
    capital: "Uyo",
    lgas: [
      { name: "Uyo", majorMarkets: ["Akpan Andem Market", "Itam International Food Market", "Plaza Area"] },
      { name: "Eket", majorMarkets: ["Urua Nka Eket", "Marina Road"] },
      { name: "Ikot Ekpene", majorMarkets: ["Ikot Ekpene Raffia Market", "Control Post"] }
    ]
  },
  {
    state: "Abia",
    capital: "Umuahia",
    lgas: [
      { name: "Aba South", majorMarkets: ["Ariaria International Market", "Ekeoha Shopping Centre", "Ngwa Road Market"] },
      { name: "Aba North", majorMarkets: ["Ehere Modern Market", "Cemetery Market"] },
      { name: "Umuahia North", majorMarkets: ["Umuahia Main Modern Market (Ubani)", "Isigate"] }
    ]
  },
  {
    state: "Adamawa",
    capital: "Yola",
    lgas: [
      { name: "Yola North", majorMarkets: ["Jimeta Modern Market", "Old Town Yola Market"] },
      { name: "Mubi North", majorMarkets: ["Mubi International Cattle & Grains Market"] }
    ]
  },
  {
    state: "Bauchi",
    capital: "Bauchi",
    lgas: [
      { name: "Bauchi", majorMarkets: ["Wunti Market", "Central Market Bauchi", "Muda Lawal Market"] },
      { name: "Katagum", majorMarkets: ["Azare Central Market"] }
    ]
  },
  {
    state: "Benue",
    capital: "Makurdi",
    lgas: [
      { name: "Makurdi", majorMarkets: ["Wurukum Market", "Modern Market Makurdi", "Wadata Market"] },
      { name: "Gboko", majorMarkets: ["Gboko Main Market", "Tiv Cultural Center Area"] }
    ]
  },
  {
    state: "Borno",
    capital: "Maiduguri",
    lgas: [
      { name: "Maiduguri", majorMarkets: ["Monday Market Maiduguri", "Custom Market", "Baga Fish Market"] },
      { name: "Jere", majorMarkets: ["Post Office Area", "Kasuwar Shanu"] }
    ]
  },
  {
    state: "Cross River",
    capital: "Calabar",
    lgas: [
      { name: "Calabar Municipality", majorMarkets: ["Watt Market", "Marian Market (Ika Ika Oqua)"] },
      { name: "Calabar South", majorMarkets: ["Anantigha Market", "Beach Market"] }
    ]
  },
  {
    state: "Ebonyi",
    capital: "Abakaliki",
    lgas: [
      { name: "Abakaliki", majorMarkets: ["Abakaliki Rice Mill Market", "Kpirikpiri Market", "Margret Umahi International Market"] }
    ]
  },
  {
    state: "Ekiti",
    capital: "Ado Ekiti",
    lgas: [
      { name: "Ado-Ekiti", majorMarkets: ["Oja Oba Ado Ekiti", "Bisi Egbeyemi Market", "Post Office Area"] },
      { name: "Ikole", majorMarkets: ["Ikole Main Market"] }
    ]
  },
  {
    state: "Gombe",
    capital: "Gombe",
    lgas: [
      { name: "Gombe", majorMarkets: ["Gombe Main Market", "Kasuwar Mata", "Tudun Wada Market"] }
    ]
  },
  {
    state: "Imo",
    capital: "Owerri",
    lgas: [
      { name: "Owerri Municipal", majorMarkets: ["Eke Ukwu Owerri Market", "Relief Market Owerri", "Alaba Imo"] },
      { name: "Owerri North", majorMarkets: ["Amakohia Market", "Orji Flyover Area"] }
    ]
  },
  {
    state: "Jigawa",
    capital: "Dutse",
    lgas: [
      { name: "Dutse", majorMarkets: ["Dutse Ultra-Modern Market", "Kasuwar Kazaure"] },
      { name: "Hadejia", majorMarkets: ["Hadejia Fish & Rice Market"] }
    ]
  },
  {
    state: "Katsina",
    capital: "Katsina",
    lgas: [
      { name: "Katsina", majorMarkets: ["Katsina Central Market", "Yar'Adua Market"] },
      { name: "Funtua", majorMarkets: ["Funtua Cotton & Grains Market"] }
    ]
  },
  {
    state: "Kebbi",
    capital: "Birnin Kebbi",
    lgas: [
      { name: "Birnin Kebbi", majorMarkets: ["Birnin Kebbi Central Market", "Aliero Market"] }
    ]
  },
  {
    state: "Kogi",
    capital: "Lokoja",
    lgas: [
      { name: "Lokoja", majorMarkets: ["Lokoja International Market", "Old Market Lokoja", "Kpata Fish Market"] },
      { name: "Okene", majorMarkets: ["Okene Main Market (Bariki)"] }
    ]
  },
  {
    state: "Kwara",
    capital: "Ilorin",
    lgas: [
      { name: "Ilorin South", majorMarkets: ["Oja Oba Ilorin", "Mandate Ultra Modern Market"] },
      { name: "Ilorin West", majorMarkets: ["Ipata Meat & Food Market", "Oloje Market"] }
    ]
  },
  {
    state: "Nasarawa",
    capital: "Lafia",
    lgas: [
      { name: "Lafia", majorMarkets: ["Lafia Modern Market", "Kasuwar Tomato"] },
      { name: "Karu", majorMarkets: ["Mararaba Market", "Nyanya-Mararaba Corridor", "Masaka"] }
    ]
  },
  {
    state: "Niger",
    capital: "Minna",
    lgas: [
      { name: "Chanchaga", majorMarkets: ["Minna Central Market", "Kure Ultra-Modern Market"] },
      { name: "Suleja", majorMarkets: ["Suleja Modern Market", "Babangida Market"] }
    ]
  },
  {
    state: "Ogun",
    capital: "Abeokuta",
    lgas: [
      { name: "Abeokuta South", majorMarkets: ["Itoku Adire Market", "Kuto Market", "Omida Market"] },
      { name: "Ado-Odo/Ota", majorMarkets: ["Sango Ota Market", "Toll Gate Area"] },
      { name: "Sagamu", majorMarkets: ["Sagamu Main Market", "Sabon Gari Kolanut Market"] }
    ]
  },
  {
    state: "Ondo",
    capital: "Akure",
    lgas: [
      { name: "Akure South", majorMarkets: ["Oja Oba Akure", "Isikan Market", "NEPA Market"] },
      { name: "Ondo West", majorMarkets: ["Moferere Market Ondo Town"] }
    ]
  },
  {
    state: "Osun",
    capital: "Osogbo",
    lgas: [
      { name: "Osogbo", majorMarkets: ["Oja Oba Osogbo", "Orisumbare Market", "Alekuwodo"] },
      { name: "Ife Central", majorMarkets: ["Oja Titun (New Market Ife)", "Post Office Market"] }
    ]
  },
  {
    state: "Plateau",
    capital: "Jos",
    lgas: [
      { name: "Jos North", majorMarkets: ["Terminus Jos Main Market", "Katako Market (Grains & Timber)", "Far Gada"] },
      { name: "Jos South", majorMarkets: ["Bukuru Market", "Building Materials Market"] }
    ]
  },
  {
    state: "Sokoto",
    capital: "Sokoto",
    lgas: [
      { name: "Sokoto North", majorMarkets: ["Sokoto Central Market (Kasuwar Rima)", "Old Market"] },
      { name: "Wamakko", majorMarkets: ["Kasuwar Daji", "Arkilla"] }
    ]
  },
  {
    state: "Taraba",
    capital: "Jalingo",
    lgas: [
      { name: "Jalingo", majorMarkets: ["Jalingo Main Market", "Kasuwan Bera", "Mile 6"] }
    ]
  },
  {
    state: "Yobe",
    capital: "Damaturu",
    lgas: [
      { name: "Damaturu", majorMarkets: ["Damaturu Central Market", "Sunday Market"] },
      { name: "Potiskum", majorMarkets: ["Potiskum Cattle & Grains Market"] }
    ]
  },
  {
    state: "Zamfara",
    capital: "Gusau",
    lgas: [
      { name: "Gusau", majorMarkets: ["Gusau Central Market", "Tudun Wada Gusau"] }
    ]
  }
];
