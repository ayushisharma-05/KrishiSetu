// Abbreviated districts list for cascading dropdowns. Real list would be 700+.
export const STATES_DISTRICTS: Record<string, string[]> = {
  "Madhya Pradesh": ["Vidisha", "Bhopal", "Indore", "Ujjain", "Sagar", "Rewa", "Jabalpur", "Gwalior", "Hoshangabad", "Shivpuri"],
  "Maharashtra": ["Pune", "Nashik", "Nagpur", "Aurangabad", "Solapur", "Ahmednagar", "Latur", "Amravati"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur", "Agra", "Meerut", "Gorakhpur", "Bareilly", "Jhansi"],
  "Punjab": ["Ludhiana", "Amritsar", "Patiala", "Jalandhar", "Bathinda", "Mohali"],
  "Haryana": ["Karnal", "Hisar", "Sirsa", "Rohtak", "Panipat", "Sonipat"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Sikar", "Alwar"],
  "Gujarat": ["Ahmedabad", "Rajkot", "Vadodara", "Surat", "Junagadh", "Bhavnagar"],
  "Karnataka": ["Bengaluru Rural", "Mysuru", "Hubli-Dharwad", "Belagavi", "Tumakuru", "Mandya"],
  "Tamil Nadu": ["Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Erode", "Thanjavur"],
  "Andhra Pradesh": ["Guntur", "Krishna", "Anantapur", "Kurnool", "Chittoor", "Nellore"],
  "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"],
  "West Bengal": ["Burdwan", "Hooghly", "Murshidabad", "Nadia", "Birbhum", "Bankura"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
  "Odisha": ["Cuttack", "Khordha", "Sambalpur", "Ganjam", "Mayurbhanj"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Palakkad"],
};

export const STATES = Object.keys(STATES_DISTRICTS);
