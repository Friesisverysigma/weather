"""
ZIP Code database for US states (excluding Alaska and Hawaii)
This module provides ZIP code data for all continental US states.
"""

# Sample ZIP codes for each state - in a real implementation, you would have complete databases
US_ZIP_CODES_BY_STATE = {
    'AL': [  # Alabama - sample ZIP codes
        '35004', '35005', '35006', '35007', '35010', '35013', '35014', '35016', '35019', '35020',
        '35021', '35022', '35023', '35031', '35033', '35034', '35035', '35036', '35040', '35041',
        '35042', '35043', '35044', '35045', '35046', '35048', '35049', '35051', '35052', '35053',
        '35054', '35055', '35057', '35058', '35060', '35061', '35062', '35063', '35064', '35068',
        '35070', '35071', '35072', '35073', '35074', '35077', '35078', '35079', '35080', '35081',
        # Add more ZIP codes here - this is just a sample
    ],
    'AZ': [  # Arizona - sample ZIP codes
        '85001', '85002', '85003', '85004', '85005', '85006', '85007', '85008', '85009', '85010',
        '85011', '85012', '85013', '85014', '85015', '85016', '85017', '85018', '85019', '85020',
        '85021', '85022', '85023', '85024', '85026', '85027', '85028', '85029', '85030', '85031',
        '85032', '85033', '85034', '85035', '85037', '85038', '85039', '85040', '85041', '85042',
        '85043', '85044', '85045', '85048', '85050', '85051', '85053', '85054', '85083', '85085',
        # Add more ZIP codes here
    ],
    'AR': [  # Arkansas - sample ZIP codes
        '71601', '71602', '71603', '71611', '71612', '71613', '71630', '71631', '71635', '71638',
        '71639', '71640', '71642', '71643', '71644', '71646', '71647', '71648', '71651', '71653',
        '71654', '71655', '71656', '71658', '71660', '71661', '71662', '71663', '71665', '71666',
        '71667', '71670', '71671', '71674', '71675', '71676', '71677', '71678', '71701', '71711',
        '71712', '71720', '71722', '71724', '71725', '71726', '71728', '71730', '71731', '71740',
        # Add more ZIP codes here
    ],
    'CA': [  # California - sample ZIP codes
        '90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90010', '90011',
        '90012', '90013', '90014', '90015', '90016', '90017', '90018', '90019', '90020', '90021',
        '90022', '90023', '90024', '90025', '90026', '90027', '90028', '90029', '90031', '90032',
        '90033', '90034', '90035', '90036', '90037', '90038', '90039', '90040', '90041', '90042',
        '90043', '90044', '90045', '90046', '90047', '90048', '90049', '90056', '90057', '90058',
        # Add more ZIP codes here
    ],
    # Add more states with their ZIP codes...
    # For brevity, I'm showing just a few states. In a real implementation,
    # you would have complete ZIP code databases for all states.
}

def get_zip_codes_for_state(state_code):
    """
    Get all ZIP codes for a given state.
    In a real implementation, this would query a comprehensive database.
    """
    return US_ZIP_CODES_BY_STATE.get(state_code, [])

def get_zip_codes_for_states(state_codes):
    """
    Get all ZIP codes for multiple states.
    """
    all_zip_codes = []
    for state_code in state_codes:
        zip_codes = get_zip_codes_for_state(state_code)
        all_zip_codes.extend(zip_codes)
    return all_zip_codes

def generate_sample_zip_codes_for_state(state_code, count=100):
    """
    Generate sample ZIP codes for testing purposes.
    This creates realistic-looking ZIP codes based on state patterns.
    """
    # ZIP code ranges by state (approximate)
    zip_ranges = {
        'AL': (35000, 36999),
        'AZ': (85000, 86999),
        'AR': (71600, 72999),
        'CA': (90000, 96699),
        'CO': (80000, 81999),
        'CT': (6000, 6999),
        'DE': (19700, 19999),
        'FL': (32000, 34999),
        'GA': (30000, 31999),
        'ID': (83200, 83999),
        'IL': (60000, 62999),
        'IN': (46000, 47999),
        'IA': (50000, 52999),
        'KS': (66000, 67999),
        'KY': (40000, 42999),
        'LA': (70000, 71599),
        'ME': (3900, 4999),
        'MD': (20600, 21999),
        'MA': (1000, 2799),
        'MI': (48000, 49999),
        'MN': (55000, 56999),
        'MS': (38600, 39999),
        'MO': (63000, 65999),
        'MT': (59000, 59999),
        'NE': (68000, 69999),
        'NV': (89000, 89999),
        'NH': (3000, 3899),
        'NJ': (7000, 8999),
        'NM': (87000, 88999),
        'NY': (10000, 14999),
        'NC': (27000, 28999),
        'ND': (58000, 58999),
        'OH': (43000, 45999),
        'OK': (73000, 74999),
        'OR': (97000, 97999),
        'PA': (15000, 19699),
        'RI': (2800, 2999),
        'SC': (29000, 29999),
        'SD': (57000, 57999),
        'TN': (37000, 38599),
        'TX': (75000, 79999),
        'UT': (84000, 84999),
        'VT': (5000, 5999),
        'VA': (22000, 24699),
        'WA': (98000, 99499),
        'WV': (24700, 26999),
        'WI': (53000, 54999),
        'WY': (82000, 83199),
        'DC': (20000, 20599),
    }
    
    if state_code not in zip_ranges:
        return []
    
    start_zip, end_zip = zip_ranges[state_code]
    zip_codes = []
    
    # Generate evenly distributed ZIP codes within the range
    step = max(1, (end_zip - start_zip) // count)
    
    for i in range(count):
        zip_code = start_zip + (i * step)
        if zip_code <= end_zip:
            zip_codes.append(f"{zip_code:05d}")
    
    return zip_codes[:count]