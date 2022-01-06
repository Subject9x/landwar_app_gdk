
const tagInfo = {
   data :[ 
        {
            title : 'Adv. Gun Sights',
            desc : 'Target of this Unit cannot gain +2 DEF when attacked at Long Range.',
            func : (moveVal, rangeDamageVal) =>{return ((moveVal / 2) + (rangeDamageVal / 2));}
        },
        {
            title : 'Afterburner',
            desc : 'During the Movement Phase, Unit may forego its Attack this turn to move up to double its max Move value.',
            func : (armorVal, moveVal) => {return ((armorVal/2) + (moveVal/3));}
        },
        {
            title : 'Armor Piercing',
            desc : 'When applying Damage from this unit’s attack. Apply the damage amount to the Target Model’s structure even if the Target Model has remaining armor points.',
            func : (rangeDamageVal) => {return (uc_calc_Damage_Range(rangeDamageVal) * 0.75);}
        },
        {
            title : 'Artillery',
            desc : 'Unit`s IF attack gains a Blast radius of 6"',
            func : (rangeDamageVal) => {return rangeDamageVal * 2}
        }
   ]
};