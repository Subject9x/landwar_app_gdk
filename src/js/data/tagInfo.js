

const tagInfo = {
    id : "core",
    data :[ 
        {
            title : 'Advanced Gun Sights',
            desc : '<b>Target</b> of this Unit <b>cannot</b> have <b>+1 DEF</b> when attacked at <b>Long Range</b>.',
            func : (rowId) =>{
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                return ((moveVal / 4) + (rangeDamageVal / 2) + (rangeVal / 2));
            },
            reqs : (rowId) =>{
                let warn = '';
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                if(rangeDamageVal < 1){
                    warn = warn + "<p>Cannot have <b>[Range Damage]</b> of 0.</p>";
                }
                if(rangeVal < 1){
                    warn = warn + "<p>Cannot have <b>[Range Distance]</b> of 0.</p>";
                }

                return warn;
            },
            eqt:'(<b>Move</b> / 2) + (<b>DMG-R</b> / 2) + (<b>Range</b> / 2)'
        },
        {
            title : 'Afterburner',
            desc : 'During the <i>Movement Phase</i>, Unit may forego any <i>Attack</i> this turn to move <b>double</b> its <b>[Move]</b>.',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                return ((armorVal/2) + (moveVal/2));
            },
            reqs : (rowId) => {
                let warn = '';
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Move]</b> greater than 0.</p>';
                }
                if(ub_tags_checkByName('Stable Fire Platform')){
                    warn = warn + '<p>Unit <i>already has</i> [Stable Fire Platform] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Move</b> / 2) + (<b>Armor</b> / 2)'
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
            title : 'Armor Piercing - Melee',
            desc : 'When applying Damage from this unit’s Melee attack. <b>Half</b> of the <i>Damage</i> may be converted to <i>Stress Points</i>, 4 Dmg : 1 Stress.',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                return (uc_calc_Damage_Melee(meleeDamageVal, moveVal) * 0.9);
            },
            reqs : (rowId) => {
                let warn = '';
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(meleeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Melee Damage]</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'<i>Melee Damage COST</i> * 90%'
        },
        {
            title : 'Armor Piercing - Ranged',
            desc : 'When applying Damage from this unit’s Ranged attack.  <b>Half</b> of the <i>Damage</i> may be converted to <i>Stress Points</i>, 4 Dmg : 1 Stress.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                return (uc_calc_Damage_Range(rangeDamageVal) * 0.9);
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'<i>Range Damage COST</i> * 90%'
        },
        {
            title : 'Artillery',
            desc : 'Unit`s Ranged attack gains a blast radius of 6". When <i>Target</i> has any remaining <b>Armor</b>, DMG applied is reduced by <b> 1/2 before any other modifier</b>.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                return rangeDamageVal * 2;
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'<b>Damage-Range</b> * 2'
        },
        {
            title : 'Battering Ram',
            desc : 'Units <i>Ranged Attacks</i> suffer <b>-3 ATK</b> but <b>ignore</b> <i>Stress Check</i> on Ram Attacks. <b>Damage</b> of Ram Attack will be <b>Size + 3</b>.',
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
            desc : 'This Unit may <b>ignore</b> <i>Overwatch</i> and <i>Terrain</i> during the <i>Movement Phase</i>.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return uc_calc_Move(moveVal, sizeVal) * 2;
            },
            reqs : (rowId) => {
                let warn = '';
                let moveVal = parseInt(document.getElementById(rowId + '_move'));
                if(moveVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Move]</b> greater than 0.</p>';
                }
                if(ub_tags_checkByName('Bomber-Area')){
                    warn = warn + '<p>Unit <i>cannot have</i> [Bomber-Area] tag.</p>';
                }
                if(ub_tags_checkByName('Bomber-Dive')){
                    warn = warn + '<p>Unit <i>cannot have</i> [Bomber-Dive] tag.</p>';
                }
                if(ub_tags_checkByName('High Altitude Flyer')){
                    warn = warn + '<p>Unit already has [High Altitude Flyer] tag.</p>';
                }
                if(ub_tags_checkByName('Flyer')){
                    warn = warn + '<p>Unit already has [Flyer] tag.</p>';
                }
                if(ub_tags_checkByName('Jump Jets')){
                    warn = warn + '<p>Unit already has [Jump Jets] tag.</p>';
                }
                return warn;
            },
            eqt:'<b>Move COST</b> * 2'
        },
        {
            title : 'Bomber-Area',
            desc : '<p>When Unit makes their <i>Ranged Attack</i> this Turn, Unit may make an <b>additional</b> <i>Ranged Attack</i> on <b>each</b> enemy Unit that it moves <b>over</b> during the <i>Movement Phase</i> within <b>2"</b> of the Unit.<ul><li><i>Damage</i> of each attack is 33% of total <b>Damage</b> value <b>rounded up</b>.</li><li> This attack <b>cannot be</b> <i>Indirect Fire</i></li><li>Treat like an <i>Overwatch</i> attack on the target.</li></ul></p>',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return uc_calc_Move(moveVal, sizeVal) * 0.5 + uc_calc_Damage_Range(rangeDamageVal) * 0.6;
            },
            reqs : (rowId) => {
                let warn = '';
                let hasJets = ub_tags_checkByName('Jump Jets');
                let hasFly = ub_tags_checkByName('Flyer');
                let hasHighFly = ub_tags_checkByName('High Altitude Flyer');
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                if(rangeDamageVal < 1){
                    warn = warn + '<p><b>Range Damage</b> must be <i>greater than</i> 0.</p>';
                }
                if(ub_tags_checkByName('Blink')){
                    warn = warn + '<p>Unit <i>cannot have</i> [Blink] tag.</p>';
                }
                if(ub_tags_checkByName('Bomber-Dive')){
                    warn = warn + '<p>Unit <i>cannot have</i> [Bomber-Dive] tag.</p>';
                }
                if(!hasJets && !hasFly && !hasHighFly){
                    warn = warn + '<p>Unit <i>must have</i> [Flyer] <b>or</b> [High Altitude Flyer] <b>or</b> [Jump Jets] tags.</p>';
                }
                return warn;
            },
            eqt:'(<b>Move Cost</b> / 2) + (<b>Range Damage Cost</b> * 0.6)'
        },
        {
            title : 'Bomber-Dive',
            desc : 'Instead of making a normal <i>Ranged Attack</i>, This Unit may make 1 <i>Ranged Attack</i> on a single target Unit that is within <b>2"</b> of this Units <i>end position</i> after its move. Any unit that is a target of a [Bomber-Dive] attack may make a <b>free</b> <i>Overwatch</i> Attack on this unit at <b>-1 ATK</b> (instead of -2). <b>Damage</b> is 50% of total <b>Damage-Ranged</b> (round up, minimum of 1).',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                return Math.max(0, (moveVal / 2)- (sizeVal * 1.25) + (uc_calc_Damage_Range(rangeDamageVal) * 0.33 ));
            },
            reqs : (rowId) => {
                let warn = '';
                let hasJets = ub_tags_checkByName('Jump Jets');
                let hasFly = ub_tags_checkByName('Flyer');
                let hasHighFly = ub_tags_checkByName('High Altitude Flyer');
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                if(rangeDamageVal < 1){
                    warn = warn + '<p><b>Range Damage</b> must be <i>greater than</i> 0.</p>';
                }
                if(ub_tags_checkByName('Bomber-Area')){
                    warn = warn + '<p>Unit requires [Bomber-Area] tag.</p>';
                }
                if(ub_tags_checkByName('Charger')){
                    warn = warn + '<p>Unit <i>cannot have</i> [Charger] tag.</p>';
                }
                if(!hasJets && !hasFly && !hasHighFly){
                    warn = warn + '<p>Unit <i>must have</i> [Flyer] <b>or</b> [High Altitude Flyer] <b>or</b> [Jump Jets] tags.</p>';
                }
                return warn;
            },
            eqt:'(<b>Move</b> / 2) - (<b>Size</b> * 1.25) + (<b>Damage-Ranged Cost</b> / 3)'
        },
        {
            title : 'Brawler',
            desc : 'Must have <b>Melee DMG</b> > 0. May <b>+1 ATK</b> and <b>+1 DEF</b> dice in <i>Melee Attacks</i>.',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                return uc_calc_Damage_Melee(meleeDamageVal, moveVal) * 0.67;
            },
            reqs : (rowId) => {
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(meleeDamageVal < 1){
                    return 'Unit must have a <b>[Melee Damage]</b> greater than 0.';
                }
                return '';
            },
            eqt:'<b>Damage-Melee COST</b> * 67%'
        },
        {
            title : 'Broadside Fire Arc',
            desc : 'Unit may <b>only</b> make <i>Ranged Attacks</i> against targets that are <i>LEFT or RIGHT</i> of Units <i>Forward facing</i>, <b>but</b> Unit may make <b>1</b> <i>Ranged Attacks</i> per side of Unit.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return uc_calc_Damage_Range(rangeDamageVal) * 0.5;
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Limited Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Limited Fire Arc] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Damage-Range<b> <i>COST</i> * 0.5)'
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
                let warn = '';
                let moveVal = parseInt(document.getElementById(rowId + '_move'));
                if(moveVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Move]</b> greater than 0.</p>';
                }
                if(ub_tags_checkByName('Bomber-Dive')){
                    warn = warn + '<p>Unit <i>cannot have</i> [Bomber-Dive] tag.</p>';
                }
                return warn;
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
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                //let structVal = parseInt(document.getElementById(rowId + '_structure').value);

                if(sizeVal == 0){
                    sizeVal = 1;
                }
                if(moveVal == 0){
                    moveVal = 6;
                }

                val = moveVal + armorVal + sizeVal; //+ structVal;
                val = val / 4;

                return val * 3;
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
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                return warn;
            },
            eqt:'<i>average</i> [<b>Size</b>, <b>Move</b>, <b>Armor</b>, <b>Structure</b>] * 3'
        },
        {
            title : 'Courage-II',
            desc : 'When Unit is making a Stress Check, Unit gets +2 to the D6 roll',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                //let structVal = parseInt(document.getElementById(rowId + '_structure').value);

                if(sizeVal == 0){
                    sizeVal = 1;
                }
                if(moveVal == 0){
                    moveVal = 6;
                }

                val = moveVal + armorVal + sizeVal;//+ structVal;
                val = val / 4;

                return val * 5;
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
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                return warn;
            },
            eqt:'<i>average</i> [<b>Size</b>, <b>Move</b>, <b>Armor</b>, <b>Structure</b>] * 5'
        },
        {
            title : 'Crew-I',
            desc : 'For stress rolls, roll 2 and take the highest (represents crew morale and squad morale). Limit of Crew Points is (Size / 3)  + 2.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                if(moveVal == 0){
                    moveVal = 8;
                }
                return Math.max(0, ((1/sizeVal^2) * 12) - sizeVal + moveVal / 3);
            },
            reqs : (rowId) => {
                let warn = '';
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal < 2){
                    warn = warn + '<p><b>[Size]</b> must be <i>greater than</i> 1.</p>';
                }
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-II] tag.</p>';
                }
                return warn;
            },
            eqt:'((1 / <b>Size</b> ^ 2) * 12) - <b>Size</b> + <b>Move</b> / 3'
        },
        {
            title : 'Crew-II',
            desc : 'For stress rolls, roll 3 and take the highest (represents crew morale and squad morale). Limit of Crew Points is (Size / 3)  + 2.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                if(moveVal == 0){
                    moveVal = 8;
                }
                return Math.max(0, ((1/sizeVal^2) * 15) - sizeVal + moveVal / 3);
            },
            reqs : (rowId) => {
                let warn = '';
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal < 3){
                    warn = warn + '<p><b>[Size]</b> must be <i>greater than</i> 2.</p>';
                }
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-I] tag.</p>';
                }
                return warn;
            },
            eqt:'((1 / <b>Size</b> ^ 2) * 15) - <b>Size</b> + <b>Move</b> / 3'
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
                if(ub_tags_checkByName('Courage-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-II] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-III')){
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
                if(ub_tags_checkByName('Overheat')){
                    warn = warn + '<p>Unit <i>already has</i> [Overheat] tag.</p>';
                }
                return warn;
            },
            eqt:'<i>Unit base total COST</i> * 25%'
        },
        {
            title : 'Flyer',
            desc : 'Unit is considered as permanently above the ground. Unit may move and shoot <b>over</b> enemy Units and Terrain. Unit cannot use <b>Cover Bonus</b> for defense and <b>all</b> units have <i>Line of sight</i> to this unit. <b>Only</b> Units with <b>[Flyer]</b> or <b>[Jump Jets]</b> can choose <i>Melee Attacks</i> when applicable. ',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                return ((sizeVal - moveVal) / 2) + (armorVal * 2);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('High Altitude Flyer')){
                    warn = warn + '<p>Unit already has [High Altitude Flyer].</p>';
                }
                if(ub_tags_checkByName('Blink')){
                    warn = warn + '<p>Unit already has [Blink].</p>';
                }
                if(ub_tags_checkByName('Jump Jets')){
                    warn = warn + '<p>Unit already has [Jump Jets].</p>';
                }
                return warn;
            },
            eqt:'((<b>Size</b> - <b>Move</b>) / 2) + (<b>Armor</b> * 2)'
        },
        {
            title : 'Fortification',
            desc : 'Unit may make unlimited <i>Overwatch</i> attacks.',
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
            desc : 'if target starts movement base-to-base, and tries to move away, Grappler may make a <b>free</b> <i>Overwatch</i> attack on the moving unit using <b>Melee Damage</b>.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                let moveCost = uc_calc_Move(moveVal, sizeVal);

                let meleeCost = uc_calc_Damage_Melee(meleeDamageVal, moveVal);

                let cost = sizeVal + (moveCost * 0.33)  + (meleeCost * 0.25);

                return cost;
            },
            reqs : (rowId) => {
                let warn = '';
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(meleeDamageVal < 1){
                    warn = warn + '<p>Unit <b>Melee Damage</b> must be greater than <b>0</b>.';
                }
                return warn;
            },
            eqt:'<b>Size</b> + (<i>Move Cost</i> * 0.33) + (<i>DMG-Melee</i> * 0.25)'
        },
        {
            title : 'Heavy Armor',
            desc : 'Unit may reduce <b>any</b> incoming <i>DMG</i> to itself by <b>half rounded up</b>, this occurs <b>before any other</b> TAGs are applied.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                return uc_calc_Armor(armorVal, sizeVal) * 0.55 + moveVal;
            },
            reqs : (rowId) => {
                let warn = '';
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);
                
                if(evadeVal > 1){
                    warn = warn + '<p>Unit <b>Evade<b> must be <i>less than</i> <b>2</b>.';
                }
                return warn;
            },
            eqt:'<b>Armor Cost</b> * 0.55 + <b>Move</b>'
        },
        {
            title : 'Hero',
            desc : 'Hero may suffer <b>+2 Stress</b> Point to allow every Friendly Unit in 8" to <b>reroll</b> 1 failed <i>Stress Check</i> per Turn. <b>IF</b> [Hero] unit is <b>destroyed</b>, <b>all</b> friendly units <b>immediately</b> suffer <b>+2 Stress</b>.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                return sizeVal + (armorVal / 2) + ((moveVal + evadeVal) / 2);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Rank - Green')){
                    warn = warn + '<p>Unit already has [Rank - Green] tag.</p>';
                }
                return warn;
            },
            eqt:'<b>Size</b> + (<b>Armor</b> / 2) + (<b>Move</b> + <b>Evade</b>) / 2'
        },
        {
            title : 'High Altitude Flyer',
            desc : '<b>Ignore</b> [Indirect Fire] attacks. <b>Ignore</b> <i>Overwatch</i> for <b>any</b> Unit missing the [High Altitude Flyer] or [Flyer] tag. Ground Units can only use <i>Long Range</i> attacks on this model. Any [High Altitude Flyer] or [Flyer] can use <i>Effective Range</i> and <i>Melee</i> attacks where applicable.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                return ((((moveVal / 2) + (sizeVal * 1.25)) / 2) + (armorVal * 0.7)) * 2;
            },
            reqs : (rowId) => {
                let warn = '';

                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                if(moveVal < 1){
                    warn = warn + '<p>Unit <i>must have</i> <b>Move Value</b> greater than <b>0</b>.</p>';
                }

                if(ub_tags_checkByName('Blink')){
                    warn = warn + '<p>Unit already has [Blink].</p>';
                }
                if(ub_tags_checkByName('Jump Jets')){
                    warn = warn + '<p>Unit already has [Jump Jets].</p>';
                }
                if(ub_tags_checkByName('Stable Fire Platform')){
                    warn = warn + '<p>Unit already has [Stable Fire Platform].</p>';
                }

                return warn;
            },
            eqt:'((((<b>Move</b> / 2) + (<b>Size</b> * 1.25) / 2) + (<b>Armor</b> * 0.7)) * 2'
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

                return (uc_calc_Damage_Range(rangeDamageVal)*0.5);
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
            eqt:'<b>Damage-Range<b> COST * 0.5'
        },
        {
            title : 'Indirect Fire',
            desc : 'Unit may select targets outside of LoS when making Ranged Attacks. <b>Each</b> Attack suffers <b>-2ATK</b> in Range, and <b>-3ATK</b> at <i>Long Range</i>.',
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

                return (sizeVal * 1.25) + ((moveVal + evadeVal) / 1.5)
            },
            reqs : (rowId) => {
                let warn = '';
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Move]</b> greater than 11".</p>';
                }
                if(ub_tags_checkByName('Stable Fire Platform')){
                    warn = warn + '<p>Unit <i>already has</i> [Stable Fire Platform] tag.</p>';
                }

                return warn;
            },
            eqt:'(<b>Size</b> * 1.25) + (<b>Move</b> + <b>Evade</b>) / 1.5'
        },
        {
            title : 'Inhibitor Munitions',
            desc : 'This Unit may choose to make an <i>additional</i> <b>DMG 0</b> <i>Ranged Attack</i>. <b>IF</b> attack hits the target, the targets <b>next</b> <i>Movement Phase</i> move is reduced to 1/2" <b>before</b> any other modifiers.',
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
            desc : 'Unit may traverse terrain vertically, uses [Flyer] rules when moving and for <i>Overwatch</i> attacks, but is otherwise treated as a ground unit.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return (sizeVal * 2) + (moveVal / 2);
            },
            reqs : (rowId) => {
                let warn = '';

                if(ub_tags_checkByName('Blink')){
                    warn = warn + '<p>Unit already has [Blink] tag.</p>'
                }
                if(ub_tags_checkByName('High Altitude Flyer')){
                    warn = warn + '<p>Unit already has [High Altitude Flyer] tag.</p>'
                }
                if(ub_tags_checkByName('Flyer')){
                    warn = warn + '<p>Unit already has [Flyer] tag.</p>'
                }
                return warn;
            },
            eqt:'(<b>Size</b> * 2) + (<b>Move</b> / 2)'
        },
        {
            title : 'Limited Fire Arc',
            desc : 'Reduce Ranged Damage Cost by 1/2. Unit may only make <i>Ranged Attacks</i> in the Forward or Rear Arc, you must choose before the game starts.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return 0 - (uc_calc_Damage_Range(rangeDamageVal) * 0.6);
            },
            reqs : (rowId) => {
                let warn = '';

                if(ub_tags_checkByName('Broadside Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Broadside Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - I')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - I] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - II')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - II] tag.</p>';
                }
                return warn;
            },
            eqt:'<i>subtract</i> (<b>Damage-Range<b> <i>COST</i> * 60%)'
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
            desc : '<b>+2</b> to all <i>Initiative Rolls</i> as long as this Unit is not destroyed <b>or</b> <i>Panicked</i>.',
            func : (rowId) => {
                return ub_row_change_points(rowId) * 0.33;
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'<i>Unit base total COST</i> * 33%'
        },
        {
            title : 'Overheat',
            desc : 'During <i>Combat Phase</i>, Unit may suffer <b>4 Stress Points</b> to re-roll <i>up to 4</i> <b>ATK<.b> dice. <b>Cannot</b> be combine with <b>[Fearless]</b>.',
            func : (rowId) => {
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return (meleeDamageVal * 2) + (rangeDamageVal * 2);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Damage-Melee</b> * 2) + (<b>Damage-Range</b> * 2)'
        },
        {
            title : 'Rank - Green',
            desc : "Unit's <i>base</i> <b>ATK/DEF</b> change to <b>2 ATK</b> and <b>2 DEF</b>.",
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
            desc : "Unit's ATK and DEF stats become <b>4 ATK</b> and <b>4 DEF</b>.",
            func : (rowId) => {
                return ub_row_change_points(rowId) * 0.4; 
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
            eqt:'<i>Unit base total COST</i> * 40%'
        },
        {
            title : 'Rank - Elite',
            desc : "<p>Unit's ATK and DEF stats become <b>4 ATK</b> and <b>4 DEF</b>.</p><p><b>Heavy Fire</b> now requires <b>2</b> <i>uncancelled</i> 6's.</p>",
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
            desc : "<p><b>+2</b> to <i>Initiative Roll</i> <b>when</b> this model has <i>Line of Sight</i> on at least <b>TWO</b> Enemy models, Unit <b>cannot be</b> <i>Panicked</i>.</p><p>Bonus <b>does not</b> stack with multiple <i>Recon</i> units, but full bonus is granted so long as at least 1 <i>Recon</i> unit is not <b>destroyed</b>.</p>",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                sizeVal = Math.max(1, sizeVal);
                moveVal = Math.max(1, moveVal);

                let sizeCost = uc_calc_Size(sizeVal);
                let moveCost = uc_calc_Move(moveVal, sizeVal);

                return sizeCost + sizeCost / moveCost * 10;
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'<b>Size Cost</b> + (<b>Size Cost</b> / <b>Move Cost</b>) * 10.'
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
            desc : "Unit may <b>subtract 1</b> from <i>Stress Penalty</i> to ranged attacks at non-closest target.",
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
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Damage-Range</b> / 2) + (<b>Range</b> / 2) + (<b>Move</b> / 4) - <b>Size</b>'
        },
        {
            title : 'Stable Fire Platform',
            desc : "Unit may <b>reroll</b> up to <b>2</b> ATK dice when <b>Stationary</b> during the <i>Movement Phase</i>. Cost less for slower units.",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);

                return Math.max(5, ((moveVal / sizeVal) * moveVal));
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Afterburner')){
                    warn = warn + '<p>Unit <i>already has</i> [Afterburner] tag.</p>';
                }
                if(ub_tags_checkByName('Inertial Dampers')){
                    warn = warn + '<p>Unit <i>already has</i> [Inertial Dampers] tag.</p>';
                }
                if(ub_tags_checkByName('Supercharger')){
                    warn = warn + '<p>Unit <i>already has</i> [Supercharger] tag.</p>';
                }
                if(ub_tags_checkByName('Stall Speed')){
                    warn = warn + '<p>Unit <i>already has</i> [Stall Speed] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Move</b> / <b>Size</b>) * <b>Size</b> | min cost 5pts.'
        },
        {
            title : 'Stall Speed',
            desc : "Unit now has a Minimum Move distance of 1/3 normal move. It must always move AT LEAST this far in its Movement Phase. IF unit cannot complete this minimum move, it is destroyed in the Resolution Phase. This model cannot take [Stable Firing Platform] along with this.",
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return 0 - (moveVal / 2);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Stable Fire Platform')){
                    warn = warn + '<p>Unit <i>already</i> has [Stable Fire Platform] tag.</p>';
                }
                return '';
            },
            eqt:'<i>subtract</i> (<b>Move</b> / 2)'
        },
        {
            title : 'Supercharger',
            desc : "If Unit moved in the <i>Movement Phase</i>, Unit may move up to 25% its total <b>Move</b> immediately after this Turn's <i>Attack Phase</i>.",
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                
                let cost = sizeVal / moveVal * moveVal;

                return cost;
            },
            reqs : (rowId) => {
                let warn = '';
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Move]</b> greater than 0".</p>';
                }
                if(ub_tags_checkByName('Stable Fire Platform')){
                    warn = warn + '<p>Unit <i>already has</i> [Stable Fire Platform] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Size</b> / <b>Move</b>) * <b>Move</b>'
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