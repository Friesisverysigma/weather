// US States and their approximate ZIP code counts (excluding Alaska and Hawaii)
export const US_STATES_ZIP_COUNTS: Record<string, number> = {
  'AL': 1050,  // Alabama
  'AZ': 850,   // Arizona
  'AR': 750,   // Arkansas
  'CA': 2650,  // California
  'CO': 650,   // Colorado
  'CT': 350,   // Connecticut
  'DE': 150,   // Delaware
  'FL': 1850,  // Florida
  'GA': 1200,  // Georgia
  'ID': 350,   // Idaho
  'IL': 1450,  // Illinois
  'IN': 950,   // Indiana
  'IA': 950,   // Iowa
  'KS': 750,   // Kansas
  'KY': 850,   // Kentucky
  'LA': 750,   // Louisiana
  'ME': 450,   // Maine
  'MD': 550,   // Maryland
  'MA': 550,   // Massachusetts
  'MI': 1150,  // Michigan
  'MN': 950,   // Minnesota
  'MS': 650,   // Mississippi
  'MO': 1150,  // Missouri
  'MT': 350,   // Montana
  'NE': 550,   // Nebraska
  'NV': 250,   // Nevada
  'NH': 250,   // New Hampshire
  'NJ': 750,   // New Jersey
  'NM': 450,   // New Mexico
  'NY': 1750,  // New York
  'NC': 1250,  // North Carolina
  'ND': 350,   // North Dakota
  'OH': 1350,  // Ohio
  'OK': 850,   // Oklahoma
  'OR': 550,   // Oregon
  'PA': 1850,  // Pennsylvania
  'RI': 100,   // Rhode Island
  'SC': 650,   // South Carolina
  'SD': 350,   // South Dakota
  'TN': 950,   // Tennessee
  'TX': 2850,  // Texas
  'UT': 350,   // Utah
  'VT': 250,   // Vermont
  'VA': 1050,  // Virginia
  'WA': 750,   // Washington
  'WV': 650,   // West Virginia
  'WI': 850,   // Wisconsin
  'WY': 200,   // Wyoming
  'DC': 50,    // District of Columbia
}

// Get all ZIP codes for a specific state (this would typically come from a database)
export async function getZipCodesForState(stateCode: string): Promise<string[]> {
  // This is a placeholder - in a real implementation, you would:
  // 1. Have a database of ZIP codes by state
  // 2. Make an API call to get ZIP codes
  // 3. Use a ZIP code service
  
  // For now, we'll return an empty array and handle this in the backend
  return []
}

// Calculate total ZIP codes for selected states
export function calculateTotalZipCodes(selectedStates: string[]): number {
  return selectedStates.reduce((total, state) => {
    return total + (US_STATES_ZIP_COUNTS[state] || 0)
  }, 0)
}

// Get state name from code
export const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming',
  'DC': 'District of Columbia',
}