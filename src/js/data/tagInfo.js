
const tagInfo = {
   data :[ 
        {
            id : 0,
            title : 'Adv. Gun Sights',
            desc : 'Target of this Unit cannot gain +2 DEF when attacked at Long Range.',
            func : (moveVal, rangeDamageVal) =>{return ((moveVal / 2) + (rangeDamageVal / 2));}
        },
        {
            id : 1,
            title : 'Afterburner',
            desc : 'During the Movement Phase, Unit may forego its Attack this turn to move up to double its max Move value.'
        }
   ]
};