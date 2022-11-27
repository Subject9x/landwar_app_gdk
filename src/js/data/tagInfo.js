

const tagInfo = {
   data :[ 
        {
            title : 'Advanced Gun Sights',
            desc : '<b>Target</b> of this Unit <b>cannot use the 2 re-rolls</b> when attacked at <b>Long Range</b>.',
            func : (rowId) =>{
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                return ((moveVal / 2) + (rangeDamageVal / 2));
            },
            reqs : (rowId) =>{
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    return "Cannot have <b>[Range Damage]</b> of 0";
                }
                return '';
            },
            eqt:'(<b>Move</b> / 2) + (<b>DMG-R</b> / 2)'
        },
        {
            title : 'Afterburner',
            desc : 'During the <i>Movement Phase</i>, Unit may forego any <i>Attack</i> this turn to move <b>double</b> its <b>[Move]</b>.',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                return ((armorVal/2) + (moveVal/3));
            },
            reqs : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal <= 0){
                    return 'Unit must have a <b>[Move]</b> greater than 0.';
                }
                return '';
            },
            eqt:'(<b>Move</b> / 3) + (<b>Armor</b> / 2)'
        },
        {
            title : 'Area Denial',
            desc : 'when comparing Unit totals for <i>Objective Secured</i>, this Unit counts as 2 instead of the normal 1.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                return sizeVal * 2.5;
            },
            reqs : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move'));
                let warn = '';
                if(moveVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Move]</b> greater than 0.</p>';
                }
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                if(rangeVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range]</b> greater than 0.</p>';
                }
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0.</p>';
                }
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(meleeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Melee Damage]</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'<b>Size</b> * 2.5'
        },
        {
            title : 'Armor Piercing',
            desc : 'When applying Damage from this unit’s attack. Up to <i>half</i> the damage may be applied to Target <b>Structure</b> <i>even if</i> the Target has remaining <b>Armor</b>.',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                return ((uc_calc_Damage_Range(rangeDamageVal) + uc_calc_Damage_Melee(meleeDamageVal, moveVal)) * 0.9);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'<i>Total Damage COST</i> * 90%'
        },
        {
            title : 'Artillery',
            desc : 'Unit`s Indirect Fire(IF) attack gains a Blast radius of 6".',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                return rangeDamageVal * 2;
            },
            reqs : (rowId) => {
                if(!ub_tags_checkByName('Indirect Fire')){
                    return 'Unit must have [Indirect Fire] tag.';
                }
                return '';
            },
            eqt:'<b>Damage-Range</b> * 2'
        },
        {
            title : 'Battering Ram',
            desc : 'Units Ranged Attacks suffer -3 ATK but ignore Stress Check on Ram Attacks. Ram Attacks deal Size + 3 DMG.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                return sizeVal * 2;
            },
            reqs : (rowId) => {
                let warn = '';
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Move]</b> greater than 0.</p>';
                }
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                if(armorVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Armor]</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'<b>Size</b> * 2'
        },
        {
            title : 'Battery',
            desc : 'Unit may divide total Ranged DMG up into several attacks at different targets.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                return Math.max(0, ((rangeVal/2) + rangeDamageVal) - sizeVal);
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Damage-Range]</b> greater than 0.</p>';
                }
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                if(rangeVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range]</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'((<b>Range</b> / 2) + <b>Damage-Range</b>) - <b>Size</b>'
        },
        {
            title : 'Blink',
            desc : 'This Unit may ignore Overwatch and Terrain during the Movement Phase',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return uc_calc_Move(moveVal, sizeVal) * 2;
            },
            reqs : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move'));
                if(moveVal <= 0){
                    return 'Unit must have a <b>[Move]</b> greater than 0.';
                }
                return '';
            },
            eqt:'<b>Move COST</b> * 2'
        },
        {
            title : 'Brawler',
            desc : 'Must have Melee DMG > 0. May Reroll 2 ATK and 1 DEF dice in Melee Attacks',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                return uc_calc_Damage_Melee(meleeDamageVal, moveVal) * 0.67;
            },
            reqs : (rowId) => {
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(meleeDamageVal <= 0){
                    return 'Unit must have a <b>[Melee Damage]</b> greater than 0.';
                }
                return '';
            },
            eqt:'<b>Damage-Melee COST</b> * 67%'
        },
        {
            title : 'Cargo',
            desc : 'Unit can instantly Pick Up an object if equal or smaller Size. \n <b>Size</b> of 0 is 1 for this tag <i>but not for tag cost</i>.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                return Math.max(0,(((moveVal / 2) + armorVal) - (sizeVal*2)));
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Move</b> /2) + <b>Armor</b> - (<b>Size</b> * 2)'
        },
        {
            title : 'Charger',
            desc : 'Unit does not provoke <i>Overwatch</i> attacks.',
            func : (rowId, ) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                return (sizeVal *2) + (moveVal / 2);
            },
            reqs : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move'));
                if(moveVal <= 0){
                    return 'Unit must have a <b>[Move]</b> greater than 0.';
                }
                return '';
            },
            eqt:'(<b>Size</b> * 2) + (<b>Move</b> / 2)'
        },
        {
            title : 'Counter-Battery Intuition',
            desc : 'Unit may use <b>Indirect Fire</b> on a Target this <i>Attack Phase</i> when the Target has attempted an <b>Indirect Fire</b> attack location within Unit`s <b>Range</b>.',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                return (moveVal / 3) + (rangeVal / 3) + (rangeDamageVal / 3); /*TODO*/
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                if(rangeVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range]</b> greater than 0.</p>';
                }
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'(<b>Damage-Range</b> / 3) + (<b>Range</b> / 3) + (<b>Move</b> / 3)'
        },
        {
            title : 'Courage-I',
            desc : 'When Unit is making a Stress Check, Unit gets +1 to the D6 roll',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let structVal = parseInt(document.getElementById(rowId + '_structure').value);

                
                return ((moveVal / 3 + armorVal / 3 + structVal) - sizeVal) * 2.5;
            },
            reqs : (rowId) => {
                let warn = '';
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                if(armorVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Armor]</b> greater than 0.';
                }
                if(ub_tags_checkByName('Courage-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-II] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-III')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-III] tag.</p>';
                }
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Move</b> / 3) + (<b>Armor</b> / 3) + <b>Structure</b> - <b>Size</<b> * 2.5'
        },
        {
            title : 'Courage-II',
            desc : 'When Unit is making a Stress Check, Unit gets +2 to the D6 roll',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let structVal = parseInt(document.getElementById(rowId + '_structure').value);
                
                return ((moveVal / 2.5 + armorVal / 2.5 + structVal) - sizeVal) * 3;
            },
            reqs : (rowId) => {
                let warn = '';
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                if(armorVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Armor]</b> greater than 0.</p>';
                }
                if(ub_tags_checkByName('Courage-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-I] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-III')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-III] tag.</p>';
                }
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Move</b> / 2.5) + (<b>Armor</b> / 2.5) + <b>Structure</b> - <b>Size</<b> * 3'
        },
        {
            title : 'Courage-III',
            desc : 'When Unit is making a Stress Check, Unit gets +3 to the D6 roll',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let structVal = parseInt(document.getElementById(rowId + '_structure').value);

                return ((moveVal / 2 + armorVal / 2 + structVal) - sizeVal) * 3.5;
            },
            reqs : (rowId) => {
                let warn = '';
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                if(armorVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Armor]</b> greater than 0.';
                }
                if(ub_tags_checkByName('Courage-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-I] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-II] tag.</p>';
                }
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Move</b> / 2) + (<b>Armor</b> / 2) + <b>Structure</b> - <b>Size</<b> * 3.5'
        },
        {
            title : 'Crew-I',
            desc : 'For stress rolls, roll 2 and take the highest (represents crew morale and squad morale). Limit of Crew Points is (Size / 3)  + 2.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                return Math.max(0, ((1/sizeVal^2) * 12) - sizeVal);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Courage-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-II] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-III')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-III] tag.</p>';
                }
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-II] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-III')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-III] tag.</p>';
                }
                return warn;
            },
            eqt:'((1 / <b>Size</b> ^ 2) * 12) - <b>Size</b>'
        },
        {
            title : 'Crew-II',
            desc : 'For stress rolls, roll 3 and take the highest (represents crew morale and squad morale). Limit of Crew Points is (Size / 3)  + 2.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                return Math.max(0, ((1/sizeVal^2) * 15) - sizeVal);
            },
            reqs : (rowId) => {
                let warn = '';
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal < 4){
                    warn = warn + '<p><b>[Size]</b> must be <i>greater than</i> 1.</p>';
                }
                if(ub_tags_checkByName('Courage-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-I] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-III')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-III] tag.</p>';
                }
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-I] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-III')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-III] tag.</p>';
                }
                return warn;
            },
            eqt:'((1 / <b>Size</b> ^ 2) * 15) - <b>Size</b>'
        },
        {
            title : 'Crew-III',
            desc : 'For stress rolls, roll 4 and take the highest (represents crew morale and squad morale). Limit of Crew Points is (Size / 3)  + 2.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                return Math.max(0, ((1/sizeVal^2) * 19) - sizeVal);
            },
            reqs : (rowId) => {
                let warn = '';
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal < 4){
                    warn = warn + '<p><b>[Size]</b> must be <i>greater than</i> 3.</p>';
                }
                if(ub_tags_checkByName('Courage-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-II] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-III] tag.</p>';
                }
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-I] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-II] tag.</p>';
                }
                return warn;
            },
            eqt:'((1 / <b>Size</b> ^ 2) * 19) - <b>Size</b>'
        },
        {
            title : 'Fearless',
            desc : 'Unit <i>automatically</i> passes any <i>Stress Check</i>.',
            func : (rowId) => {
                return ub_row_change_points(rowId) * 0.25;
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Courage-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-I] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-II] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-III] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-I] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-II] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-III')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-III] tag.</p>';
                }
                return warn;
            },
            eqt:'<i>Unit base total COST</i> * 25%'
        },
        {
            title : 'Field Repair Kit',
            desc : 'During Combat Phase, instead of making an Attack, Unit may target a Friendly Unit and repair a number of Armor Points on that Unit equal to this Unit Size / 2 ',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                return Math.max(0, (moveVal / 2)- (sizeVal * 1.25));
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Move</b> / 2) - (<b>Size</b> * 1.25)'
        },
        {
            title : 'Fortification',
            desc : 'Unit may make unlimited overwatch attacks',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return Math.max(0, (moveVal - sizeVal)) + (rangeDamageVal / 2);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Move</b> - <b>Size</b>) + (<b>Damage-Range</b> / 2)'
        },
        {
            title : 'Forward Observer',
            desc : '+1 to Initiative. For this Combat Phase, this Friendly Model may ignore the penalty to Indirect Fire attacks on any target THIS unit has LoS for.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return ((1/sizeVal^2) * 10) + (moveVal / 2);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'((1 / <b>Size</b> ^ 2) * 10 ) + (<b>Move</b> / 2)'
        },
        {
            title : 'Grappler',
            desc : 'if target starts movement base-to-base, and tries to move away, Grappler may make an Overwatch attack on the moving unit.',
            func : (rowId) => {
                return 0; /*TODO */
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'TODO'
        },
        {
            title : 'Heavy Armor I',
            desc : 'DEBUG Unit may reduce the <b>DMG</b> effect of <i>Armor Piercing</i> by <b>half</b>.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                // 3/evade * moveVal - (armorVal/2 + size)
                return sizeVal + (armorVal / 2) + ((moveVal + evadeVal) / 2);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'<b>Size</b> + (<b>Armor</b> / 2) + (<b>Move</b> + <b>Evade</b>) / 2'
        },
        {
            title : 'Hero',
            desc : 'Hero may suffer +1 Stress Point to allow every Friendly Unit in 8" to reroll 1 failed Stress Check this Turn.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                return sizeVal + (armorVal / 2) + ((moveVal + evadeVal) / 2);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'<b>Size</b> + (<b>Armor</b> / 2) + (<b>Move</b> + <b>Evade</b>) / 2'
        },
        {
            title : 'High Altitude Flyer',
            desc : 'Ignore IF attacks. Ignore Overwatch for any ground units. Ground Units can only use Long Range attacks on this model. Any flyer can use regular Range attacks.',
            func : (rowId) => {
                return 0; /*TODO */
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'TODO'
        },
        {
            title : 'Hole where your house was',
            desc : 'Once per game, once per this tag, Player may remove 1 piece of Terrain during the Combat Phase.',
            func : (rowId) => {
                return 0;  /*TODO */
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:''
        },
        {
            title : 'Hull Gun - I',
            desc : 'Unit <b>may</b> fire as if it has the <i>Limit Fire Arc</i> tag but may add <b>+25%</b> rounded-up of its DMG-R value to the attack.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return (uc_calc_Damage_Range(rangeDamageVal)*0.2);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Limited Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Limited Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - II')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - II] tag.</p>';
                }
                return warn;
            },
            eqt:'<b>Damage-Range<b> COST * 0.2'
        },
        {
            title : 'Hull Gun - II',
            desc : 'Unit <b>may</b> fire as if it has the <i>Limit Fire Arc</i> tag but may add <b>+50%</b> rounded-up of its DMG-R value to the attack.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return (uc_calc_Damage_Range(rangeDamageVal)*0.45);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Limited Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Limited Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - I')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - I] tag.</p>';
                }
                return warn;
            },
            eqt:'<b>Damage-Range<b> COST * 0.45'
        },
        {
            title : 'Indirect Fire',
            desc : 'Unit may select targets outside of LoS when making Ranged Attacks. Each Attack suffers -2ATK in Range, and -3ATK at Long Range.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);

                return (rangeDamageVal / 2) + (rangeVal / 2)
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                if(rangeVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range]</b> greater than 0.</p>';
                }
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'(<b>Damage-Range</b> / 2) + (<b>Range</b> / 2)'
        },
        {
            title : 'Inertial Dampers',
            desc : '"When Move is greater than 12", treat this Unit as having moved only 11" in the Combat Phase.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);

                return (sizeVal * 1.25) + ((moveVal + evadeVal) / 2)
            },
            reqs : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal <= 0){
                    return 'Unit must have a <b>[Move]</b> greater than 11".';
                }
                return '';
            },
            eqt:'(<b>Size</b> * 1.25) + (<b>Move</b> + <b>Evade</b>) / 2'
        },
        {
            title : 'Inhibitor Munitions',
            desc : 'IF this Unit hits its Target in a <i>Ranged Attack</i>, place a token next to that Unit. On the next move phase, that Unit may only move 1/2 its current speed. Remove token after next move phase regardless of target`s move. Effect does not stack. Ranged Attack deals 0 damage.',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);

                return (moveVal / 2) + (rangeVal / 2);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Move</b> / 2) + (<b>Range</b> / 2)'
        },
        {
            title : 'Jump Jets',
            desc : 'Unit may traverse terrain vertically, uses flight rules when moving and for <i>Overwatch</i> attacks, but is otherwise treated as a ground unit',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return (sizeVal * 2) + (moveVal / 2);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Size</b> * 2) + (<b>Move</b> / 2)'
        },
        {
            title : 'Limited Fire Arc',
            desc : 'Reduce Ranged Damage Cost by 1/2. Unit may only make <i>Ranged Attacks</i> in the Forward or Rear Arc, you must choose before the game starts.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return 0 - (uc_calc_Damage_Range(rangeDamageVal)/2);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Hull Gun - I')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - I] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - II')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - II] tag.</p>';
                }
                return warn;
            },
            eqt:'<i>subtract</i> (<b>Damage-Range<b> <i>COST</i> / 2)'
        },
        {
            title : 'Limited Use Weapon',
            desc : 'Unit has an extra weapon and use at specificed ATK and specified range in place of its normal attack or an overwatch attack. Discard after use.',
            func : (rowId) => {
                return 0; /*TODO*/
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'TODO'
        },
        {
            title : 'Mobile HQ',
            desc : '<b>+2</b> to all <i>Initiative Rolls</i> as long as this Unit is not destroyed.',
            func : (rowId) => {
                return ub_row_change_points(rowId) * 0.25;
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'<i>Unit base total COST</i> * 25%'
        },
        {
            title : 'Overheat',
            desc : 'During <i>Combat Phase</i>, Unit may suffer <b>4 Stress Points</b> to re-roll the dice of the <b>Base ATK</b> roll. <b>Cannot</b> be combine with <b>[Fearless]</b>.',
            func : (rowId) => {
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return (meleeDamageVal * 2) + (rangeDamageVal * 2);
            },
            reqs : (rowId) => {
                if(ub_tags_checkByName('Fearless')){
                    return 'Unit <i>already has</i> [Fearless] tag.';
                }
                return '';
            },
            eqt:'(<b>Damage-Melee</b> * 2) + (<b>Damage-Range</b> * 2)'
        },
        {
            title : 'Rank - Green',
            desc : "Unit's <i>base</i> <b>ATK/DEF</b> change to <b>3 ATK</b> and <b>2 DEF</b>.",
            func : (rowId) => {
                return 0 - ub_row_change_points(rowId) * 0.5; 
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Rank - Veteran')){
                    warn = warn + '<p>Unit <i>already has</i> <b>[Rank - Veteran]</b> tag.</p>';
                }
                if(ub_tags_checkByName('Rank - Elite')){
                    warn = warn + '<p>Unit <i>already has</i> <b>[Rank - Elite]</b> tag.</p>';
                }
                return warn;
            },
            eqt:'<i>subtract Unit base total COST</i> * 50%'
        },
        {
            title : 'Rank - Veteran',
            desc : "Unit's ATK and DEF stats become 5 ATK Dice and 4 DEF Dice",
            func : (rowId) => {
                return ub_row_change_points(rowId) * 0.33; 
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Rank - Green')){
                    warn = warn + '<p>Unit <i>already has</i> <b>[Rank - Green]</b> tag.</p>';
                }
                if(ub_tags_checkByName('Rank - Elite')){
                    warn = warn + '<p>Unit <i>already has</i> <b>[Rank - Elite]</b> tag.</p>';
                }
                return warn;
            },
            eqt:'<i>Unit base total COST</i> * 33%'
        },
        {
            title : 'Rank - Elite',
            desc : "Unit's ATK and DEF stats become 6 ATK Dice and 5 DEF Dice",
            func : (rowId) => {
                return ub_row_change_points(rowId) * 0.5; 
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Rank - Green')){
                    warn = warn + '<p>Unit <i>already has</i> <b>[Rank - Green]</b> tag.</p>';
                }
                if(ub_tags_checkByName('Rank - Veteran')){
                    warn = warn + '<p>Unit <i>already has</i> <b>[Rank - Veteran]</b> tag.</p>';
                }
                return warn;
            },
            eqt:'<i>Unit base total COST</i> * 50%'
        },
        {
            title : 'Recon',
            desc : "<b>+1</b> to <i>Initiative</i> <b>when</b> this model has <i>Line of Sight</i> on at least one Enemy model.",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                sizeVal = Math.max(1, sizeVal);
                moveVal = Math.max(1, moveVal);
                return ((1 / moveVal^2) * 100) + (sizeVal * 1.5);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'((1 / <b>Move</b>^2) * 100 ) + (<b>Size</b> * 1.5)'
        },
        {
            title : 'Self-Healing',
            desc : "Instead of Moving this turn, Unit may recover 1/3 round-down Armor points. All Attacks by this Unit this turn are at -4 ATK Dice",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                return Math.max(0, (armorVal * 2) - sizeVal);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Armor</b> * 2) - <b>Size</b>'
        },
        {
            title : 'Shapeshifter',
            desc : "Treat as Transform, calculate costs as normal for Transform. Then, add this cost. Allows Unit to MOVE even if it has switched modes this turn.",
            func : (rowId) => {
                return 0;/*TODO*/
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'TODO'
        },
        {
            title : 'Sharpshooter',
            desc : "Unit does not suffer Stress penalty for targeting non-closest Enemy Unit",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);

                return Math.max(0, ((rangeDamageVal / 2) + (rangeVal / 2) + (moveVal / 4)) - sizeVal);
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                if(rangeVal<= 0){
                    warn = warn + '<p>Unit must have a <b>[Range]</b> greater than 0".</p>';
                }
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0".</p>';
                }
                return warn;
            },
            eqt:'(<b>Damage-Range</b> / 2) + (<b>Range</b> / 2) + (<b>Move</b> / 4) - <b>Size</b>'
        },
        {
            title : 'Stable Fire Platform',
            desc : "Unit gains an additional +1 ATK when declaring Stationary during the Movement Phase. Cost less for slower units.",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);

                return Math.max(0, ((moveVal / 2) + (evadeVal * 2)) - sizeVal);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Move</b> / 2) + (<b>Evade</b> * 2) - <b>Size</b>'
        },
        {
            title : 'Stall Speed',
            desc : "Unit now has a Minimum Move distance of 1/3 normal move. It must always move AT LEAST this far in its Movement Phase. IF unit cannot complete this minimum move, it is destroyed in the Resolution Phase. This model cannot take Stable Firing Platform along with this.",
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return 0 - (moveVal / 3);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'<i>subtract</i> (<b>Move</b> - <b>Move</b> / 3)'
        },
        {
            title : 'Supercharger',
            desc : "If Unit moved in the <i>Movement Phase</i>, Unit may move up to 25% its total <b>Move</b> immediately after this Turn's <i>Attack Phase</i>.",
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);

                return uc_calc_Move(moveVal, sizeVal) * 0.25;
            },
            reqs : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal <= 0){
                    return 'Unit must have a <b>[Move]</b> greater than 0".';
                }
                return '';
            },
            eqt:'<b>Move COST</b> * 25%'
        },
        {
            title : 'Terrifying',
            desc : 'When Unit has finished its move, <b>all</b> Enemy Units within 6" <b>immediately</b> suffer <b>1 Stress Point</b>',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return ((1 / sizeVal^2) * 10) + moveVal;
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'((1 / <b>Size</b>^2) * 10) + (<b>Move</b> - 6) / 2'
        },
        {
            title : 'Thunderous Report',
            desc : 'Target of this Unit suffers <b>+1 Stress</b> when taking <b>Damage</b> from <i>Ranged Attacks.</i> ',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return (moveVal/2) + (rangeVal * 1.25) - rangeDamageVal;
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Move</b> / 2) + (<b>Range</b> * 1.25) - (<b>Range Damage</b>)'
        },
        {
            title : 'Transport',
            desc : "Unit can carry a number of <i>Friendly Units</i> whose <b>Sizes</b> when totaled are equal to or less than half this Unit's Size. \nSize 0 becomes Size 1 for this.",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal === 0){
                    sizeVal = 1;
                }
                return sizeVal + 2;
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Size</b> * 2) + (<b>Move</b> / 2) + (<b>Armor</b> / 3)'
        }
   ]
};

function tagInfo_hasTag(tagName){
    let tagId = -1;
    for(let tag in tagInfo.data){
        if(tagInfo.data[tag].title === tagName){
            tagId = tag;
        }
    }
    return tagId;
}