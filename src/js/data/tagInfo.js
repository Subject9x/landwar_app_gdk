
let sortedTags = [];

const tagInfo = {
    id : "core",
    data :[ 
        {
            abrv: 'ADVGS',
            title : 'Advanced Gun Sights',
            desc : '<p><i>Combat Phase</i></p><p><b>Target</b> of this Unit <b>cannot</b> have <b>+1 DEF</b> when attacked at <b>Long Range</b>.</p>',
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
                if(ub_tags_checkByName('Optimal Range - Short')){
                    warn = warn + '<p>Unit already has the <b>[Optimal Range - Short]</b> tag.</p>';
                }
                if(ub_tags_checkByName('Optimal Range - Long')){
                    warn = warn + '<p>Unit already has the <b>[Optimal Range - Long]</b> tag.</p>';
                }

                return warn;
            },
            eqt:'(<b>Move</b> / 2) + (<b>DMG-R</b> / 2) + (<b>Range</b> / 2)'
        },
        {
            abrv: 'AFTBRN',
            title : 'Afterburner',
            desc : '<p><i>Movement Phase</i></p><p>During the <i>Movement Phase</i>, Unit may forego any <i>Attack</i> this turn to move <b>double</b> its <b>[Move]</b>.</p>',
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
            abrv: 'ARDNEL',
            title : 'Area Denial',
            desc : "<p><i>Resolution Phase</i></p><p>Unit cannot be <i>Panicked</i></p><p>When checking for <i>Local Objectives</i> and comparing remaining total Armor; <b>add 50% <i>Size Value</i></b> of Unit to Unit's <b>current</b> <i>Armor</i>.</p>",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                return sizeVal * 1.5;
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
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(rangeDamageVal <= 0 || meleeDamageVal <= 0){
                    warn = warn + '<p>Unit must have <i>either</i> <b>Range Damage</b> <i>or</i> <b>Melee Damage</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'<b>Size</b> * 1.5'
        },
        {
            abrv: 'AP-MEL',
            title : 'Armor Piercing - Melee',
            desc : "<p><i>Combat Phase</i></p><p>When applying Damage from this unit's <i>Melee</i> attack; <b>If</b> Target has the <i>[Heavy Armor]</b> tag, <b>ignore it</b>. If Target does not have this tag, Target suffers <b>+2 Stress</b> along with the damage of the attack.</p>",
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                return (uc_calc_Damage_Melee(meleeDamageVal, moveVal) * 0.6);
            },
            reqs : (rowId) => {
                let warn = '';
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(meleeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Melee Damage]</b> greater than 0.</p>';
                }
                return warn;
            },
            eqt:'<i>Melee Damage COST</i> * 60%'
        },
        {
            abrv: 'AP-RNG',
            title : 'Armor Piercing - Ranged',
            desc : "<p><i>Combat Phase</i></p><p>When applying Damage from this unit's <i>Ranged</i> attack; <b>If</b> Target has the <i>[Heavy Armor]</i> tag, <b>ignore it</b>. If Target <b>does not</b> have <i>[Heavy Armor]</i>, Target suffers <b>+2 Stress</b> along with the damage of the attack. <i>DMG</i> value of this attack must <b>always be 4+</b>.</p>",
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                return (uc_calc_Damage_Range(rangeDamageVal) * 0.8);
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal < 4){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 3.</p>';
                }
                return warn;
            },
            eqt:'<i>Range Damage COST</i> * 80%'
        },
        {
            abrv: 'BTRY',
            title : 'Battery',
            desc : '<p><i>Combat Phase</i></p><p>Unit may divide total Ranged DMG up into several attacks at different targets.</p>',
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
                if(rangeDamageVal <= 1){
                    warn = warn + '<p>Unit must have a <b>[Damage-Range]</b> greater than 1.</p>';
                }
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                if(rangeVal < 1){
                    warn = warn + '<p>Unit must have a <b>[Range]</b> greater than 0.</p>';
                }

                if(ub_tags_checkByName('Blast')){
                    warn = warn + '<p>Unit already has the <b>[Blast]</b> tag.</p>';
                }

                return warn;
            },
            eqt:'((<b>Range</b> / 2) + <b>Damage-Range</b>) - <b>Size</b>'
        },
        {
            abrv: 'BLAST',
            title : 'Blast',
            desc : '<p><i>Combat Phase</i></p><p>When this Unit makes a <i>Ranged Attack</i>, Player may declare this attack is using <i>[Blast]</i>. Select a Target unit as normal, and make the attack roll. <b>If</b> the attack hits, Target takes <b>25% round down</b> damage and <b>+1 Stress</b>. The remaining damage is split <b>equally</b> across <b>all</b> units within a 6" radius of the <b>Target regardless of LoS.</b></p><p>Attacker picks which units are hit first. <i>Stationary</i> units must also be picked first and are hit automatically <b>even if they are friendly</b>, other units may avoid damage on 1 D6 roll of 5+.</p>',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);

                return (moveVal / 4) + (rangeVal / 3) + (rangeDamageVal / 2);
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0.</p>';
                }

                if(ub_tags_checkByName('Battery')){
                    warn = warn + '<p>Unit already has the <b>[Battery]</b> tag.</p>';
                }

                return warn;
            },
            eqt:'(<b>Move</b> / 4) + (<b>Range</b> / 3) + (<b>Damage-Range</b> / 2)'
        },
        {
            abrv: 'BLNK',
            title : 'Blink',
            desc : '<p><i>Movement Phase</i></p><p>This Unit may <b>ignore</b> <i>Terrain</i> movement restrictions, and may move through enemy units during the <i>Movement Phase</i>.</p>',
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
            abrv: 'BMBR-AR',
            title : 'Bomber-Area',
            desc : '<p><i>Combat Phase</i></p><p>When Unit makes their <i>Ranged Attack</i> this Turn, Unit may make an <b>additional</b> <i>Ranged Attack</i> on <b>each</b> enemy Unit that it moves <b>over</b> during the <i>Movement Phase</i> within <b>2"</b> of the Unit.<ul><li><i>Damage</i> of each attack is 33% of total <b>Damage</b> value <b>rounded up</b>.</li><li> This attack <b>cannot be</b> <i>Indirect Fire</i></li><li>These attacks are at <b>-2 ATK</b>.</li></ul></p>',
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
            abrv: 'BMBR-DV',
            title : 'Bomber-Dive',
            desc : '<p><i>Combat Phase</i></p><p>Instead of making a normal <i>Ranged Attack</i>, This Unit may make 1 <i>Ranged Attack</i> on a single target Unit that is within <b>2"</b> of this Units <i>end position</i> after its move. Any unit that is a target of a [Bomber-Dive] attack may make a <b>free</b> Attack on this unit at <b>-1 ATK</b>. <b>Damage</b> is 50% of total <b>Damage-Ranged</b> (round up, minimum of 1).</p>',
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
            abrv: 'BRWL',
            title : 'Brawler',
            desc : '<p><i>Combat Phase</i></p><p><b>+1 ATK</b> and <b>+1 DEF</b> in <i>Melee Attacks</i>.</p>',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                return uc_calc_Damage_Melee(meleeDamageVal, moveVal) * 0.67;
            },
            reqs : (rowId) => {
                let warn = '';
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(meleeDamageVal < 1){
                    warn = warn + '<p>Unit must have a <b>[Melee Damage]</b> greater than 0.</p>';
                }
                if(ub_tags_checkByName('Optimal Range - Long')){
                    warn = warn + '<p>Unit already has the <b>[Optimal Range - Long]</b> tag.</p>';
                }
                return warn;
            },
            eqt:'<b>Damage-Melee COST</b> * 67%'
        },
        {
            abrv: 'ARC-BRD',
            title : 'Broadside Fire Arc',
            desc : '<p><i>Combat Phase</i></p><p>Unit may <b>only</b> make <i>Ranged Attacks</i> against targets that are <i>LEFT or RIGHT</i> of Units <i>Forward facing</i>, <b>but</b> Unit may make <b>1</b> <i>Ranged Attacks</i> per side of Unit.</p><p>Target models must be <i>inside</i> this Units left or right side, and cannot be counted for <i>both</i> at the same time.</p>',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return uc_calc_Damage_Range(rangeDamageVal) * 0.5;
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Limited Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Limited Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Narrow Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Limited Fire Arc] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Damage-Range<b> <i>COST</i> * 0.5)'
        },
        {
            abrv: 'CARG',
            title : 'Cargo',
            desc : '<p><i>Movement Phase</i></p><p>Unit can instantly Pick Up an object if equal or smaller Size. \n <b>Size</b> of 0 is 1 for this tag <i>but not for tag cost</i>.</p>',
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
            abrv: 'CHRGR',
            title : 'Charger',
            desc : '<p><i>Movement Phase</i></p><p>Unit does not suffer <i>Stress</i> penalty for <i>Flanking</i>.</p>',
            func : (rowId, ) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                return (sizeVal * 1.5) + (moveVal / 2);
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
            eqt:'(<b>Size</b> * 1.5) + (<b>Move</b> / 2)'
        },
        {
            abrv: 'CLOAK',
            title : 'Cloaking Systems',
            desc : '<p><i>Initiative Phase</i> <b>before</b> the roll off!</p><p>Unit <b>cannot</b> make any <i>Attacks</i> this turn. Unit does not <b>cause</b> <i>Flanking</i> stress. Unit may only move <b>half</b> their current <i>Move</i> value.</p><p>Unit gains <b>+2 DEF</b>, or <b>+3 DEF</b> IF <i>Stationary</i>.</p>',
            func : (rowId, ) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal == 0){
                    moveVal = 1;
                }
                let moveCost = uc_calc_Move(moveVal, sizeVal);
                
                return (moveCost * 0.45) + (sizeVal / 2);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Heavy Armor')){
                    warn = warn + '<p>Unit <i>cannot have</i> [Heavy Armor] tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Move COST</b> 45%) + (<b>Size</b> / 2)'
        },
        {
            abrv: 'CNTR-BATT',
            title : 'Counter-Battery',
            desc : '<p><i>Combat Phase</i></p><p>Unit may use <b>Indirect Fire</b> on a Target this <i>Attack Phase</i> when the Target has attempted an <b>Indirect Fire</b> attack location within Unit`s <b>Range</b>.</p>',
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
            abrv: 'CRG1',
            title : 'Courage-I',
            desc : '<p><i>Resolution Phase</i>.</p><p>When Unit is making a <i>Stress Check</i>, Unit gets <b>+1</b> to the D6 roll.</p>',
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

                val = (moveVal + armorVal + sizeVal) / 4; //+ structVal;

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
                // if(ub_tags_checkByName('Overheat')){
                //     warn = warn + '<p>Unit <i>already has</i> [Overheat] tag.</p>';
                // }
                return warn;
            },
            eqt:'<i>average</i> [<b>Size</b>, <b>Move</b>, <b>Armor</b>] * 2'
        },
        {
            abrv: 'CRG2',
            title : 'Courage-II',
            desc : '<p><i>Resolution Phase</i>.</p><p>When Unit is making a <i>Stress Check</i>, Unit gets <b>+2</b> to the D6 roll.</p>',
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

                val = (moveVal + armorVal + sizeVal) / 4;//+ structVal;

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
                // if(ub_tags_checkByName('Overheat')){
                //     warn = warn + '<p>Unit <i>already has</i> [Overheat] tag.</p>';
                // }
                return warn;
            },
            eqt:'<i>average</i> [<b>Size</b>, <b>Move</b>, <b>Armor</b>] * 5'
        },
        {
            abrv: 'CRW1',
            title : 'Crew-I',
            desc : '<p><i>Resolution Phase</i>.</p>For stress rolls, roll 2D6 and take the highest (represents crew morale and squad morale). Limit of Crew Points is (Size / 3)  + 2.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                if(sizeVal == 0){
                    sizeVal = 1;
                }
                if(armorVal == 0){
                    armorVal = 1;
                }

                let sizeRaise = Math.pow(sizeVal, 2);
                
                return ((1/ sizeRaise) * 20) * armorVal;
            },
            reqs : (rowId) => {
                let warn = '';
                
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    warn = warn + '<p>Unit must have <i>Size</i> > 0.</p>';
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
                if(ub_tags_checkByName('Crew-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-II] tag.</p>';
                }
                if(ub_tags_checkByName('Overheat')){
                    warn = warn + '<p>Unit <i>already has</i> [Overheat] tag.</p>';
                }
                return warn;
            },
            eqt:'((1 / <b>Size</b> ^ 2) * 20) * <b>Armor</b>'
        },
        {
            abrv: 'CRW2',
            title : 'Crew-II',
            desc : '<p><i>Resolution Phase</i>.</p>For stress rolls, roll 3D6 and take the highest (represents crew morale and squad morale). Limit of Crew Points is (Size / 3)  + 2.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                if(sizeVal == 0){
                    sizeVal = 1;
                }
                if(armorVal == 0){
                    armorVal = 1;
                }
                let sizeRaise = Math.pow(sizeVal, 2);

                return ((1 / sizeRaise) * 33) * armorVal;
            },
            reqs : (rowId) => {
                let warn = '';
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal < 3){
                    warn = warn + '<p><b>[Size]</b> must be <i>greater than</i> 2.</p>';
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
                if(ub_tags_checkByName('Crew-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-I] tag.</p>';
                }
                if(ub_tags_checkByName('Overheat')){
                    warn = warn + '<p>Unit <i>already has</i> [Overheat] tag.</p>';
                }
                return warn;
            },
            eqt:'((1 / <b>Size</b> ^ 2) * 33) * <b>Armor</b>'
        },
        {
            abrv: 'FRLS',
            title : 'Fearless',
            desc : '<p><i>Resolution Phase</i>.</p><p>Unit <i>automatically</i> passes any <i>Stress Check</i>.</p>',
            func : (rowId) => {
                return ub_row_change_points(rowId) * 0.35;
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Courage-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-I] tag.</p>';
                }
                if(ub_tags_checkByName('Courage-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Courage-II] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-I')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-I] tag.</p>';
                }
                if(ub_tags_checkByName('Crew-II')){
                    warn = warn + '<p>Unit <i>already has</i> [Crew-II] tag.</p>';
                }
                if(ub_tags_checkByName('Overheat')){
                    warn = warn + '<p>Unit <i>already has</i> [Overheat] tag.</p>';
                }
                if(ub_tags_checkByName('Hero')){
                    warn = warn + '<p>Unit <i>already has</i> [Hero] tag.</p>';
                }
                return warn;
            },
            eqt:'<i>Unit base total COST</i> * 35%'
        },
        {
            abrv: 'FLY',
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
            abrv: 'FORT',
            title : 'Fortification',
            desc : '<p><i>Movement Phase</i>.</p><p>Unit ignores <i>Flanking</i> penalty when <i>Stationary</i>. Enemy Units <i>Flanking</i> suffer additional <b>+1  Stress</i>.</p>',
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
            abrv: 'FWRDOBS',
            title : 'Forward Observer',
            desc : '<p><i>Movement Phase</i>.</p><p><b>Unit cannot be Panicked.</b></p><p>Unit suffers <b>-1 DEF</b> and <b>-2 Evade</b> to mark 1 enemy Unit in <i>Line of Sight</i>. Friendly Units may treat marked target as if in <i>Line of Sight</i> for this <i>Combat Phase</i>.</p>',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                if(moveVal == 0){
                    moveVal = 1;
                }

                let sub = (sizeVal * 3) - (moveVal / 2);
                if(sub <= 0){
                    sub = sizeVal;
                }
                sub = sub / 2;
                return sub;

            },
            reqs : (rowId) => {
                let warn = '';

                if(ub_tags_checkByName('Recon')){
                    warn = warn + '<p>Unit <i>already has</i> [Recon].';
                }
                if(ub_tags_checkByName('Mobile HQ')){
                    warn = warn + '<p>Unit <i>already has</i> [Mobile HQ].';
                }
                return warn;
            },
            eqt:'((1 / <b>Size</b> ^ 2) * 10 ) + (<b>Move</b> / 2)'
        },
        {
            abrv: 'GRPL',
            title : 'Grappler',
            desc : '<p><i>Movement Phase</i></p><p>Unit may <b>ignore</b> the <i>Danger Close</i> movement rule when it moves.</p>',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);                
                
                let moveCost = uc_calc_Move(moveVal, sizeVal);

                if(sizeVal == 0){
                    sizeVal = 2;
                }

                if(moveVal == 0){
                    moveVal = 4;
                }

                return (0 - (sizeVal * 0.5)) + (moveCost * 0.25);
            },
            reqs : (rowId) => {
                let warn = '';
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(meleeDamageVal < 1){
                    warn = warn + '<p>Unit <b>Melee Damage</b> must be greater than <b>0</b>.</p>';
                }
                if(moveVal < 1){
                    warn = warn + '<p>Unit must have a <i>Move value</i>.</p>'
                }
                return warn;
            },
            eqt:'(0 - (<b>Size</b> * %50)) + (<i>Move Cost</i> * 0.25)'
        },
        {
            abrv: 'HVYARM',
            title : 'Heavy Armor',
            desc : '<p><i>Combat Phase</i>.</p><p>Unit may reduce <b>any</b> incoming <i>DMG</i> to itself by <b>half rounded down</b>, this occurs <b>before any other</b> TAGs are applied.</p>',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                return uc_calc_Armor(armorVal, sizeVal) * 0.8 + (moveVal * 1.25);
            },
            reqs : (rowId) => {
                let warn = '';
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);
                
                if(evadeVal > 0){
                    warn = warn + '<p>Unit <b>Evade<b> must be <b>0</b>.';
                }
                
                if(ub_tags_checkByName('Weak Rear Armor')){
                    warn = warn + "<p>Unit <i>already has</i> [Weak Rear Armor].";
                }
                return warn;
            },
            eqt:'(<b>Armor Cost</b> * 0.8) + (<b>Move</b> * 1.25)'
        },
        {
            abrv: 'HERO',
            title : 'Hero',
            desc : '<p><i>Resolution Phase</i>.</p><p>Hero may suffer <b>+2 Stress</b> Point to allow every Friendly Unit in 8" to <b>reroll</b> 1 failed <i>Stress Check</i> per Turn. <b>IF</b> [Hero] unit is <b>destroyed</b>, <b>all</b> friendly units <b>immediately</b> suffer <b>+2 Stress</b>.</p>',
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
            abrv: 'HIALT',
            title : 'High Altitude Flyer',
            desc : '<b>Ignore</b> [Indirect Fire] attacks. <b>Ignore</b> <i>Flanking</i> for <b>any</b> Unit missing the [High Altitude Flyer] or [Flyer] tag. Ground Units can only use <i>Long Range</i> attacks on this model. Any [High Altitude Flyer] or [Flyer] can use <i>Effective Range</i> and <i>Melee</i> attacks where applicable.',
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
            abrv: 'HLGUN1',
            title : 'Hull Gun - I',
            desc : '<p><i>Combat Phase</i>.</p><p>Unit <b>may</b> fire as if it has the <i>Limit Fire Arc</i> tag but may add <b>+25%</b> rounded-up of its DMG-R value to the attack.</p>',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return uc_calc_Damage_Range(rangeDamageVal) * 0.2;
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Limited Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Limited Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Narrow Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Narrow Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - II')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - II] tag.</p>';
                }
                return warn;
            },
            eqt:'<b>Damage-Range<b> COST * 0.2'
        },
        {
            abrv: 'HLGUN2',
            title : 'Hull Gun - II',
            desc : '<p><i>Combat Phase</i>.</p><p>Unit <b>may</b> fire as if it has the <i>Limit Fire Arc</i> tag but may add <b>+50%</b> rounded-up of its DMG-R value to the attack.</p>',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return uc_calc_Damage_Range(rangeDamageVal)*0.4;
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Limited Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Limited Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Narrow Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Narrow Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - I')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - I] tag.</p>';
                }
                return warn;
            },
            eqt:'<b>Damage-Range<b> COST * 0.4'
        },
        {
            abrv: 'IF',
            title : 'Indirect Fire',
            desc : '<p><i>Combat Phase</i>.</p><p>Unit may select targets <b>outside</b> <i>Line of Sight</i> when making <i>Ranged Attacks</i>. Target <b>must</b> be within <b>50% of</b> <i>Effective Range</i> of the attacking Unit.</p>',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                
                let rangeCost = uc_calc_Range(moveVal, rangeVal, rangeDamageVal);

                return (rangeDamageVal / 2) + (rangeCost * 0.45);
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

                if(ub_tags_checkByName('Field Artillery')){
                    warn = warn + '<p>Unit must have the <i>[Field Artillery]</i> tag.</p>';
                }

                // if(!ub_tags_checkByName('Minimum Range')){
                //     warn = warn + '<p>Unit must have the <i>[Minimum Range]</i> tag.</p>';
                // }
                return warn;
            },
            eqt:'(<b>Damage-Range</b> / 3) + (45% of <b>Range Cost</b>)'
        },
        {
            abrv: 'INERTIAL',
            title : 'Inertial Dampers',
            desc : '<p><i>Combat Phase</i></p><p>If Unit completes move that was <i>High Speed Move</i> (14+"), ignore the <b>-2 ATK</b> effect. </p>',
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
            abrv: 'INHBTMNS',
            title : 'Inhibitor Munitions',
            desc : '<p><i>Combat Phase</i></p><p>Player must declare this <b>before</b> the Unit makes its <i>Ranged Attack</i>.</p><p>Units <i>Ranged Attack</i> <b>DMG set to 0</b>. <b>When</b> attack hits the target, the targets <b>next</b> <i>Movement Phase</i> move is reduced to 1/2 <b>before</b> any other modifiers.</p>',
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
            abrv: 'JGRNAT',
            title : 'Juggernaut',
            desc : '<p><i>Movement Phase</i><p/><p>Units <i>Ranged Attacks</i> suffer <b>-1 ATK</b>.</p><p>Any time Unit enters <i>Melee Range</i> after moving <b>1/2 or more</b> of their current <i>Move Value</i>, <b>+Size / 2</b> to Units next <i>Melee Attack</i>.</p>',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);

                return (sizeVal * 0.5) + (moveVal * 0.5) + (meleeDamageVal * 0.25);
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
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                if(meleeDamageVal < 1){
                    warn = warn + '<p>Unit must have <b>Damage-Melee</b> value.';
                }
                return warn;
            },
            eqt:'(50% <b>Size</b> round down) + (50% <b>Move</b> round down) + (<b>Damage-Melee</b> 25% round up)'
        },
        {
            abrv: 'JJ',
            title : 'Jump Jets',
            desc : '<p><i>Movement Phase</i></p><p>Unit may traverse terrain vertically, uses [Flyer] rules when moving, but is otherwise treated as a ground unit. Unit still subject to <i>Flanking</i> check.</p>',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal == 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal == 0){
                    moveVal = 1;
                }
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
            abrv: 'ARC-LFA',
            title : 'Limited Fire Arc',
            desc : '<p><i>Combat Phase</i></p><p>Unit may only make <i>Ranged Attacks</i> in the Forward or Rear Arc, you must choose before the game starts.</p>',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return 0 - (uc_calc_Damage_Range(rangeDamageVal) * 0.45);
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                if(rangeVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range]</b> greater than 0.</p>';
                }
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0.</p>';
                }

                if(ub_tags_checkByName('Broadside Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Broadside Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - I')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - I] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - II')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - II] tag.</p>';
                }
                if(ub_tags_checkByName('Narrow Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Narrow Fire Arc] tag.</p>';
                }
                return warn;
            },
            eqt:'<i>Subtract</i> (<b>Damage-Range<b> <i>COST</i> * 45%)'
        },
        {
            abrv: 'RNGMIN',
            title : 'Minimum Range',
            desc : "<p><i>Combat Phase</i></p><p>When making a <b>Range Attack</b>, the Target <b>cannot be</b> 25% <b>or less</b> of Unit's <i>Effective Range</i> close, <b>minimum 8\"</b>.</p><p><b>[Field Artillery]</b> if the Unit has this tag, Unit may select targets within <b>100%</b> of <i>Effective Range</i>.</p>",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value)
                let moveVal = parseInt(document.getElementById(rowId + '_move').value)
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let evadeVal  = parseInt(document.getElementById(rowId + '_evade').value);

                if(sizeVal == 0){
                    sizeVal  = 1;
                }

                return (0 + (uc_calc_Evade(sizeVal, evadeVal, moveVal) * 0.1)) - ((uc_calc_Range(moveVal, rangeVal, rangeDamageVal) * 0.5) + sizeVal);
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                if(rangeVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range]</b> greater than 0.</p>';
                }
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0.</p>';
                }
                if(ub_tags_checkByName('Optimal Range - Long')){
                    warn = warn + '<p>Unit already has the <b>[Optimal Range - Long]</b> tag.</p>';
                }
                if(ub_tags_checkByName('Optimal Range - Short')){
                    warn = warn + '<p>Unit already has the <b>[Optimal Range - Short]</b> tag.</p>';
                }
                

                return warn;
            },
            eqt:'<i>Subtract</i> (<b>Range<b> <i>COST</i> * 50%) and <b>Size</b> <i>Value</i> from total.'
        },
        {
            abrv: 'MHQ',
            title : 'Mobile HQ',
            desc : '<p><i>Initiative Phase</i></p><p><b>Unit cannot be <i>Panicked</i>.</b></p><p>Player may add <b>+2</b> to their <i>initiative roll</i>.</p>',
            func : (rowId) => {
                return ub_row_change_points(rowId) * 0.33;
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Forward Observer')){
                    warn += '<p>Unit <i>already has</i> [Forward Observer].</p>';
                }
                if(ub_tags_checkByName('Recon')){
                    warn += '<p>Unit <i>already has</i> [Recon].</p>';
                }
                return warn;
            },
            eqt:'<i>Unit base total COST</i> * 33%'
        },
        {
            abrv: 'ARC-NAR',
            title : 'Narrow Fire Arc',
            desc : "<p><i>Combat Phase</i></p><p>Targets of this Unit's <i>Ranged Attacks</i> must be 1/2 Target-model width inside the <b>width</b> of this Unit`s model. <i>Minimum width of 1\" for Unit width.</i>.</p>",
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return 0 - (uc_calc_Damage_Range(rangeDamageVal) * 0.75);
            },
            reqs : (rowId) => {
                let warn = '';
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                if(rangeVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range]</b> greater than 0.</p>';
                }
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0.</p>';
                }

                if(ub_tags_checkByName('Broadside Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Broadside Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Limited Fire Arc')){
                    warn = warn + '<p>Unit <i>already has</i> [Limited Fire Arc] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - I')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - I] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - II')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - II] tag.</p>';
                }
                return warn;
            },
            eqt:'<i>Subtract</i> (<b>Damage-Range<b> <i>COST</i> * 60%)'
        },
        {
            abrv: 'OVRHT',
            title : 'Overheat',
            desc : '<p><i>Combat Phase</i></p><p><b>Unit cannot be Panicked.</b></p><p>During <i>Combat Phase</i>, Unit may suffer <b>3 Stress Points</b> to re-roll <i>up to 3</i> <b>ATK</b> dice. <b>Cannot</b> be combined with <b>[Fearless]</b>.</p>',
            func : (rowId) => {
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                return (((meleeDamageVal + rangeDamageVal) / 2) * 3) + (rangeVal / 3);
            },
            reqs : (rowId) => {
                let warn = '';
                if(ub_tags_checkByName('Fearless')){
                    warn = warn + '<p>Unit <i>already has</i> [Fearless] tag.</p>';
                }
                return warn;
            },
            eqt:'(<i>average</i> <b>Damage-Melee</b> and <b>Damage-Range</b>) * 3 + (<b>Range</b> / 3)'
        },
        {
            abrv: 'PCKDEPL',
            title : 'Pack / Deploy',
            desc : '<p>Player must choose whether this unit <i>moves</i> <b>OR</b> <i>attacks</i> on this turn.</p><p>At the <b>end</b> of the <i>Initiative Phase</i>, Units with this tag must declare if they will move or shoot this turn.</p>',
            func : (rowId) => {
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);

                let moveCost = uc_calc_Move(moveVal, sizeVal) * 0.85;
                let rangeCost = uc_calc_Damage_Range(rangeDamageVal) * 0.85;
                let meleeCost = uc_calc_Damage_Melee(meleeDamageVal, moveVal) * 0.85;

                return 0 - (moveCost + rangeCost + meleeCost);
            },
            reqs : (rowId) => {
                let warn = '';
                let dmgVal = parseInt(document.getElementById(rowId + '_DMGM').value) + parseInt(document.getElementById(rowId + '_DMGR').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value)

                if(dmgVal < 1){
                    warn = warn + '<p>Unit <b>must</b> have either a <i>Ranged</i> <b>or</b> <i>Melee</i> damage value.</p>';
                }
                if(moveVal < 1){
                    warn = warn + '<p>Unit <b>must</b> have a <i>Move</i> value greater than <b>0</b>.</p>';
                }
                return warn;
            },
            eqt:'<i>Subtract</i> 85% of <b>Move Cost</b> and 85% of each <b>Melee/Range</b> costs.'
        },
        {
            abrv: 'RNKG',
            title : 'Rank - Green',
            desc : "Unit's <i>base</i> <b>ATK/DEF</b> change to <b>2 ATK</b> and <b>2 DEF</b>.",
            func : (rowId) => {
                return 0 - ub_row_change_points(rowId) * 0.85; 
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
            eqt:'<i>subtract Unit base total COST</i> * 85%'
        },
        {
            abrv: 'RNKV',
            title : 'Rank - Veteran',
            desc : "<p><i>Combat Phase</i></p><p>Unit may <i>re-roll</i> <b>1 ATK</b> and <b>1 DEF</b> <i>per-turn</i>.</p>",
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
            abrv: 'RNKE',
            title : 'Rank - Elite',
            desc : "<p><i>Initiative Phase</i></p><p>Player gains <b>+1</b> to their initiative roll per-Unit with this tag.</p><p><i>Combat Phase</i></p><p>Unit may <i>re-roll</i> <b>2 ATK</b> and <b>2 DEF</b> <i>per-turn</i>.</p>",
            func : (rowId) => {
                return ub_row_change_points(rowId) * 0.6; 
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
            eqt:'<i>Unit base total COST</i> * 60%'
        },
        {
            abrv: 'RCN',
            title : 'Recon',
            desc : "<p><i>Initiative Phase</i></p><p><b>Unit cannot be Panicked.</b></p><p>Player may <b>+2</b> to their <i>Initiative</i> roll total <b>IF</b> this Unit has <i>Line of Sight</i> on <b>at least 2</b> target models in <b>Effective Range</b> during the <i>Initiative Phase</i>.</p><p>Unit suffers <b>-3 ATK</b> this <i>Combat Phase</i> to use the tag.</p>",
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                rangeVal = Math.max(1, rangeVal);

                return (((rangeVal / 2) + (moveVal / 2)) / 2) + armorVal / 2;
            },
            reqs : (rowId) => {
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let warn = '';

                if(ub_tags_checkByName('Mobile HQ')){
                    warn = warn + '<p>Unit <i>already has</i> [Mobile HQ].</p>';
                }
                if(ub_tags_checkByName('Forward Observer')){
                    warn = warn + '<p>Unit <i>already has</i> [Forward Observer].</p>';
                }
                if(rangeVal < 1){
                    warn = warn + '<p><i>Effective Range</i> must be <b>at least 8"</b>.</p>';
                }

                return warn;
            },
            eqt:'<i>Average</i> of (<b>Range</b> / 2) + (<b>Move</b> / 2), then add (<b>Armor</b> / 2)'
        },
        {
            abrv: 'ROLLSTP',
            title : 'Rolling Stop',
            desc : '<p><i>Movement Phase</i></p><p><b>If</b> Unit is declared <i>Stationary</i> and they moved the <i>previous Turn</i>, Unit <b>must</b> move a distance of <b>25% <i>Move</i></b>, minimum <b>2\"</b>. <b>If</b> Unit enters melee range of an enemy, this <b>does not</b> count for <i>Danger Close</i> or any other melee, ramming effects.</p>',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return 0 - (uc_calc_Move(moveVal, sizeVal) * 0.15);
            },
            reqs : (rowId) => {
                let warn = '';

                if(ub_tags_checkByName('Stall Speed')){
                    warn = warn + "<p>Unit <i>already has</i> [Stall Speed] tag.</p>";
                }

                return warn;
            },
            eqt:'<i>subtract</i>  15% of <b>Move COST</b>'
        },
        {
            abrv: 'SCNDTUR',
            title : 'Secondary Turrets',
            desc : "<p><i>Combat Phase</i>.</p><p>Unit <b>may</b> make a <i>Ranged Attack</i> <b>outside</b> its fire arc, but <i>damage</i> of attack is only <b>33% rounded up, Min 1</b> of the total.</p>",
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                
                let rangeDamageCost = uc_calc_Damage_Range(rangeDamageVal);
                let rangeCost = uc_calc_Range(moveVal, rangeVal, rangeDamageVal);

                
                return (rangeDamageCost * 0.2) + (rangeCost * 0.2);
            },
            reqs : (rowId) => {
                let warn = '';

                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    warn = warn + '<p>Unit must have a <b>[Range Damage]</b> greater than 0".</p>';
                }

                if((ub_tags_checkByName('Limited Fire Arc') == false) && (ub_tags_checkByName('Narrow Fire Arc') == false) && (ub_tags_checkByName('Broadside Fire Arc') == false)){
                    warn = warn + '<p>Unit <i>must have</i> one of the following: [Broadside Fire Arc], [Limited Fire Arc], [Narrow Fire Arc] tags.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - I')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - I] tag.</p>';
                }
                if(ub_tags_checkByName('Hull Gun - II')){
                    warn = warn + '<p>Unit <i>already has</i> [Hull Gun - II] tag.</p>';
                }

                return warn;
            },
            eqt:'(20% of <b>Damage-Range COST</b>) + (20% of <b>Range COST</b>)'
        },
        {
            abrv: 'HEAL',
            title : 'Self-Healing',
            desc : "<p><i>Movement Phase</i></p><p>Player declares using this tag, Unit's <i>Move Value</i> is <b>reduced by half round down.</b>. Unit <b>may not make any attacks this turn</b>.</p><p>Unit may <b>regain</b> a number of <i>Armor</i> equal to <i>Size</i> value.</p>",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                let armorCost = uc_calc_Armor(armorVal, sizeVal);

                return (armorCost * 0.2) + (moveVal / 2) + (sizeVal * 1.25);
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(+20% of <b>Armor COST</b>) + (<b>Move</b> / 2) + (<b>Size</b> * 1.25)'
        },
        {
            abrv: 'SHRPS',
            title : 'Sharpshooter',
            desc : "<p><i>Combat Phase</i></p></p>Unit may <b>subtract 1</b> from <i>Stress Penalty</i> to ranged attacks at non-closest target.</p>",
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
                if(ub_tags_checkByName('Optimal Range - Short')){
                    warn = warn + '<p>Unit already has the <b>[Optimal Range - Short]</b> tag.</p>';
                }
                if(ub_tags_checkByName('Optimal Range - Long')){
                    warn = warn + '<p>Unit already has the <b>[Optimal Range - Long]</b> tag.</p>';
                }
                return warn;
            },
            eqt:'(<b>Damage-Range</b> / 2) + (<b>Range</b> / 2) + (<b>Move</b> / 4) - <b>Size</b>'
        },
        {
            abrv: 'STABLE',
            title : 'Stable Fire Platform',
            desc : "<p><i>Combat Phase</i></p><p>Unit may <b>reroll</b> up to <b>2</b> ATK dice when <b>Stationary</b> during the <i>Movement Phase</i>. Cost less for slower units.</p>",
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
            abrv: 'STLLSPD',
            title : 'Stall Speed',
            desc : "<p><i>Movement Phase</i></p><p>Unit now has a Minimum Move distance of 1/3 normal move. It must always move AT LEAST this far in its Movement Phase. IF unit cannot complete this minimum move, it is destroyed in the Resolution Phase. This model cannot take <i>[Stable Firing Platform]</i> along with this.</p>",
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
            abrv: 'SPRCHRGR',
            title : 'Supercharger',
            desc : "<p><i>Movement Phase</i></p><p>If Unit moved in the <i>Movement Phase</i>, Unit may move up to 33% its total <b>Move</b> immediately after this Turn's <i>Attack Phase</i>.</p>",
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                
                let cost =((sizeVal / moveVal) * (moveVal * 0.4));

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
            eqt:'(<b>Size</b> / <b>Move</b>) * (40% <b>Move</b> )'
        },
        {
            abrv: 'TRFFY',
            title : 'Terrifying',
            desc : '<p><i>Movement Phase</i></p><p>When Unit has finished its move, <b>all</b> Enemy Units within 6" <b>immediately</b> suffer <b>1 Stress Point</b></p>',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal === 0){
                    sizeVal = 1;
                }
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal === 0){
                    moveVal = 1;
                }
                let sizeRaise = Math.pow(sizeVal, 2);
                let sub = ((1 / sizeRaise) * moveVal) * 25;
                
                return sub;

            },
            reqs : (rowId) => {
                let warn = '';
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                if(moveVal <= 0){
                    warn = warn + "<p>Unit must have a <i>Move val</i> <b>greater than 0</b>.";
                }
                return warn;
            },
            eqt:'((1 / <b>Size</b>^2) * <b>Move</b>) * 25'
        },
        {
            abrv: 'THNDR',
            title : 'Thunderous Report',
            desc : '<p><i>Combat Phase</i></p><p>Target of this Unit suffers <b>+1 Stress</b> from <i>Ranged Attacks.</i></p>',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return ((moveVal/3) + (rangeVal * 1.15)) - rangeDamageVal;
            },
            reqs : (rowId) => {
                return '';
            },
            eqt:'(<b>Move</b> / 2) + (<b>Range</b> * 1.25) - (<b>Range Damage</b>)'
        },
        {
            abrv: 'TRNSP',
            title : 'Transport',
            desc : "<p><i>Movement Phase</i></p><p>Unit can carry a number of <i>Friendly Units</i> whose <b>Sizes</b> when totaled are equal to or less than half this Unit's Size. \nSize 0 becomes Size 1 for this.</p>",
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
        },
        {
            abrv: 'WKARM',
            title : 'Weak Rear Armor',
            desc : "<p><i>Combat Phase</i></p><p><b>If</b> Unit takes <i>any</i> <b>DMG</b> and the source of the damage is in the Unit's <i>Rear Facing Arc</i>, then Unit suffers <i>extra</i> <b>50% DMG</b> (<i>round up</i>) of the current attack.</p>",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);

                let armorCost = uc_calc_Armor(armorVal, sizeVal);
                let moveCost = uc_calc_Move(moveVal, sizeVal);

                return (moveCost / 3) + (0 - (armorCost * 0.67)) + (evadeVal / 2);
            },
            reqs : (rowId) => {
                let warn = '';

                if(ub_tags_checkByName('Heavy Armor')){
                    warn = warn + "<p>Unit <i>already has</i> [Heavy Armor].";
                }

                return warn;
            },
            eqt:'(<b>Move</b> / 2) - (40% of <b>Armor COST</b>)'
        },
        {
            abrv: 'COORDFR',
            title : 'Coordinated Fire',
            desc : '<p><i>Combat Phase</i></p><p><b>Once per Turn</b>, when this Unit makes a <i>Ranged Attack</i>; <b>before</b> rolling, Player may declare <b>up to 2</b> other Friendly Units within <b>8”</b>. All selected units <b>must</b> fire at the same target, but each unit gains <b>+1 ATK</b>.</p><p>Ranged Attacks are resolved as normal but affected Units <b>cannot</b> use any <i>TAG</i> that would split their <i>Ranged Damage</i>,but <b>+1 Stress</b> for missed attacks. Secondary Units can only be selected <b>once</b> per Turn for this <i>TAG</i>.</p>',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return (moveVal / 1.5) + (armorVal / 3) + (rangeVal / 2) + (rangeDamageVal / 2);
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
            eqt:'(<b>Move</b> / 1.5) + (<b>Armor</b> / 3) + (<b>Range</b> / 1.5) + (<b>DMG-R</b> / 2)'
        },
        {
            abrv: 'FLDART',
            title : 'Field Artillery',
            desc : '<p><i>Combat Phase</i>.</p><p>Unit may select targets <b>outside</b> <i>Line of Sight</i> when making <i>Ranged Attacks</i>. Target <b>cannot</b> be at <i>Long Range</i> of the attacking Unit.</p>',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                
                let rangeCost = uc_calc_Range(moveVal, rangeVal, rangeDamageVal);

                return (rangeDamageVal / 3) + (rangeCost * 0.65);
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
                if(ub_tags_checkByName('Indirect Fire')){
                    warn = warn + '<p>Unit must have the <i>[Indirect Fire]</i> tag.</p>';
                }
                // if(!ub_tags_checkByName('Minimum Range')){
                //     warn = warn + '<p>Unit must have the <i>[Minimum Range]</i> tag.</p>';
                // }
                return warn;
            },
            eqt:'(<b>Damage-Range</b> / 3) + (65% of <b>Range Cost</b>)'
        },
        {
            abrv: 'RNGOPTSH',
            title : 'Optimal Range - Short',
            desc : '<p><i>Combat Phase</i>.</p><p>Unit may extend <i>Close Range</i> bonus to <b>10"</b>. <b>Additional -1 ATK</b> at <i>Long Range</i>, and <i>Ranged Damage</i> reduce by <b>50% rounded down</b> for all attacks outside of <b>10"</b>.</p>',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                
                let rangeCost = uc_calc_Range(moveVal, rangeVal, rangeDamageVal);

                let rangeDiscount = (0 - (rangeCost * 0.67));

                return rangeDiscount + rangeDamageVal/2;
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
                if(ub_tags_checkByName('Minimum Range')){
                    warn = warn + '<p>Unit already has the <i>[Minimum Range]</i> tag.</p>';
                }
                if(ub_tags_checkByName('Advanced Gun Sights')){
                    warn = warn + '<p>Unit already has the <i>[Advanced Gun Sights]</i> tag.</p>';
                }
                if(ub_tags_checkByName('Sharpshooter')){
                    warn = warn + '<p>Unit already has the <i>[Sharpshooter]</i> tag.</p>';
                }
                if(ub_tags_checkByName('Optimal Range - Long')){
                    warn = warn + '<p>Unit already has the <i>[Optimal Range - Long]</i> tag.</p>';
                }
                return warn;
            },
            eqt:'(subtract 67% of <i>Ranged Cost</i>) then <b>add</b> <i>Ranged Attack</i> / 2 '
        },
        {
            abrv: 'RNGOPTLN',
            title : 'Optimal Range - Long',
            desc : '<p><i>Combat Phase</i>.</p><p><b>-1 ATK</b> and <b>50%</b> <i>Ranged Damage</i> to any Target <b>at or under 16"</b> of range.</p>',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                
                let rangeCost = uc_calc_Range(moveVal, rangeVal, rangeDamageVal);
                let rangeDiscount = rangeCost * 0.5;

                return (0 - (rangeDiscount + (rangeDamageVal / 2)));
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
                if(ub_tags_checkByName('Minimum Range')){
                    warn = warn + '<p>Unit already has the <i>[Minimum Range]</i> tag.</p>';
                }
                if(ub_tags_checkByName('Sharpshooter')){
                    warn = warn + '<p>Unit already has the <i>[Sharpshooter]</i> tag.</p>';
                }
                if(ub_tags_checkByName('Brawler')){
                    warn = warn + '<p>Unit already has the <i>[Brawler]</i> tag.</p>';
                }
                if(ub_tags_checkByName('Optimal Range - Short')){
                    warn = warn + '<p>Unit already has the <i>[Optimal Range - Short]</i> tag.</p>';
                }
                return warn;
            },
            eqt:'subtract ((50% of <i>Ranged Cost</i>) + (<i>Ranged Attack</i> / 2))'
        }
   ]
};

function tagInfo_hasTag(tagName){
    let tagId = -1;
    for(let tag in tagInfo.data){
        let tagObj = tagInfo.data[tag];
        if(tagObj === null || tagObj === undefined || Object.keys(tagObj).length <= 0 || tagObj["disabled"]){
            if(tagObj.title === tagName){
                tagId = tag;
            }
        }
    }

    return tagId;
}


function isTag(element, index, array){
    if(element.abrv == this){
        return element;
    }
    return undefined;
}

//run me once at app boot.
function initializeSortedTagList(){
    let tagCount = 0;
    for(let tagId in tagInfo.data){
        let tag = tagInfo.data[tagId];
        tagCount++;
        tag.id = tagCount;
        console.log(tag.id + ":" + tag.title + " | " + tag.abrv);
        sortedTags.push(tag);
    }
    sortedTags = sortedTags.sort((a, b) => a.title.localeCompare(b.title));
}
