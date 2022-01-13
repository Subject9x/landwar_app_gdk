

const tagInfo = {
   data :[ 
        {
            title : 'Adv. Gun Sights',
            desc : 'Target of this Unit cannot gain +2 DEF when attacked at Long Range.',
            func : (rowId) =>{
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                return ((moveVal / 2) + (rangeDamageVal / 2));
            },
            reqs : (rowId) =>{
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                if(rangeDamageVal <= 0){
                    return "Cannot have Range Damage of 0";
                }
                return '';
            }
        },
        {
            title : 'Afterburner',
            desc : 'During the Movement Phase, Unit may forego its Attack this turn to move up to double its max Move value.',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                return ((armorVal/2) + (moveVal/3));
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Armor Piercing',
            desc : 'When applying Damage from this unit’s attack. Apply the damage amount to the Target Model’s structure even if the Target Model has remaining armor points.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                return ((uc_calc_Damage_Range(rangeDamageVal) + uc_calc_Damage_Melee(meleeDamageVal)) * 0.75);
            },
            reqs : (rowId) => {
                return '';
            }
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
            }
        },
        {
            title : 'Battering Ram',
            desc : 'Units Ranged Attacks suffer -3 ATK but ignore Stress Check on Ram Attacks. Ram Attacks deal Size + 3 DMG.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                return sizeVal * 2;
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Battery',
            desc : 'Unit may divide total Ranged DMG up into several attacks at different targets.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
                return Math.max(0, ((rangeVal/2) + rangeDamageVal) - sizeVal);
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Blink',
            desc : 'This Unit may ignore Overwatch and Terrain during the Movement Phase',
            func : (rowId) => {
                //meleeDamageVal, rangeDamageVal, rangeVal
                return 0;/*TODO*/
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Brawler',
            desc : 'Must have Melee DMG > 0. May Reroll 2 ATK and 1 DEF dice in Melee Attacks',
            func : (rowId) => {
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                return uc_calc_Damage_Melee(meleeDamageVal) * 0.67;
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Cargo',
            desc : 'Unit can instantly Pick Up an object if equal or smaller Size.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
                return Math.max(0,(((moveVal / 2) + armorVal) - (sizeVal*2)));
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Charger',
            desc : 'Unit does not provoke Overwatch attacks.',
            func : (rowId, ) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                return (sizeVal *2) + (moveVal / 2);
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Counter Battery Intuition',
            desc : 'If an indirect fire attack lands within this units LOS, it may treat the unit that fired it as being in its LoS for the next shooting phase.',
            func : (rowId) => {return 0; /*TODO*/},
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Courage (X)',
            desc : 'When Unit is making a Stress Check, Unit may add this many points to the D6 roll.',
            func : (rowId) => {return 0; /*TODO*/},
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Crew (X)',
            desc : 'For stress rolls, roll x and take the highest (represents crew morale and squad morale). Limit of Crew Points is (Size / 3)  + 2.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                return ((1/sizeVal^2) * 75) + sizeVal;
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Fearless',
            desc : 'Unit automatically passes any Stress Check.',
            func : (rowId) => {
                return 0; /*TODO*/
            },
            reqs : (rowId) => {
                return '';
            }
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
            }
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
            }
        },
        {
            title : 'Forward Observer',
            desc : '+1 to Initiative. For this Combat Phase, this Friendly Model may ignore the penalty to Indirect Fire attacks on any target THIS unit has LoS for.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return ((1/sizeVal^2) * 10) + (moveVal / 2);
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Grappler',
            desc : 'if target starts movement base-to-base, and tries to move away, Grappler may make an Overwatch attack on the moving unit.',
            func : (rowId) => {
                return 0; /*TODO */
            },
            reqs : (rowId) => {
                return '';
            }
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
            }
        },
        {
            title : 'High Altitude Flyer',
            desc : 'Ignore IF attacks. Ignore Overwatch for any ground units. Ground Units can only use Long Range attacks on this model. Any flyer can use regular Range attacks.',
            func : (rowId) => {
                return 0; /*TODO */
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Hole where your house was',
            desc : 'Once per game, once per this tag, Player may remove 1 piece of Terrain during the Combat Phase.',
            func : (rowId) => {
                return 0;  /*TODO */
            },
            reqs : (rowId) => {
                return '';
            }
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
                return '';
            }
        },
        {
            title : 'Inertial Dampners',
            desc : '"When Move is greater than 12", treat this Unit as having moved only 11" in the Combat Phase.',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);

                return (sizeVal * 1.25) + ((moveVal + evadeVal) / 2)
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Inhibitor Munitions',
            desc : 'When a Ranged Attack hits the target, place a token next to that Unit. On the next move phase, that Unit may only move 1/2 its current speed. Remove token after next move phase regardless of target`s move. Effect does not stack. Ranged Attack deals 0 damage.',
            func : (rowId) => {
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);
                let rangeVal = parseInt(document.getElementById(rowId + '_range').value);

                return (moveVal / 2) + (rangeVal / 2);
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Jump Jets',
            desc : 'Unit may traverse terrain vertically, uses flight rules when moving and for Overwatch attacks, but is otherwise treated as a ground unit',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return (sizeVal * 2) + (moveVal / 2);
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Limited Fire Arc',
            desc : 'Reduce Ranged Damage Cost by 1/2. Unit may only make Ranged Attacks in the Forward or Rear Arc, you must choose before the game starts.',
            func : (rowId) => {
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return 0 - (uc_calc_Damage_Range(rangeDamageVal)/2);
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Limited Use Weapon',
            desc : 'Unit has an extra weapon and use at specificed ATK and specified range in place of its normal attack or an overwatch attack. Discard after use.',
            func : (rowId) => {
                return 0; /*TODO*/
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Mobile HQ',
            desc : 'Add +2 to all Initiative Rolls as long as this Unit is not destroyed.',
            func : (rowId) => {
                return 0; /*TODO*/
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Overheat',
            desc : 'During Combat Phase, Unit may suffer 4 Stress Points to re-roll their Base ATK Dice roll. Cannot be combine with Fearless.',
            func : (rowId) => {
                let meleeDamageVal = parseInt(document.getElementById(rowId + '_DMGM').value);
                let rangeDamageVal = parseInt(document.getElementById(rowId + '_DMGR').value);

                return (meleeDamageVal * 2) + (rangeDamageVal * 2);
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Rank - Green',
            desc : "Unit's ATK and DEF stats become 2 ATK Dice and 1 DEF Dice",
            func : (rowId) => {
                return 0; /*TOOD*/
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Rank - Veteran',
            desc : "Unit's ATK and DEF stats become 4 ATK Dice and 3 DEF Dice",
            func : (rowId) => {
                return 0; /*TOOD*/
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Rank - Elite',
            desc : "Unit's ATK and DEF stats become 5 ATK Dice and 4 DEF Dice",
            func : (rowId) => {
                return 0; /*TOOD*/
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Recon',
            desc : "+1 to Initiative Rolls when this model has LoS on at least one Enemy model.",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return ((1 / moveVal^2) * 100) + (sizeVal * 1.5);
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Self Healing',
            desc : "Instead of Moving this turn, Unit may recover 1/3 round-down Armor points. All Attacks by this Unit this turn are at -4 ATK Dice",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let armorVal = parseInt(document.getElementById(rowId + '_armor').value);

                return Math.max(0, (armorVal * 2) - sizeVal);
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Shapeshifter',
            desc : "Treat as Transform, calculate costs as normal for Transform. Then, add this cost. Allows Unit to MOVE even if it has switched modes this turn.",
            func : (rowId) => {
                return 0;/*TODO*/
            },
            reqs : (rowId) => {
                return '';
            }
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
                return '';
            }
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
            }
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
            }
        },
        {
            title : 'Supercharger',
            desc : "During the Movement Phase, Unit may move up to its max movement + 25% rounded up.",
            func : (rowId) => {
                return 0;
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Terrifying',
            desc : 'When Unit has finished its move, all Enemy Units within 6" immediately suffer 1 Stress Point',
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                let moveVal = parseInt(document.getElementById(rowId + '_move').value);

                return ((1 / sizeVal^2) * 10) + moveVal;
            },
            reqs : (rowId) => {
                return '';
            }
        },
        {
            title : 'Transport',
            desc : "Unit can carry a number of Friendly Units whose Sizes when totaled are equal to or less than half this Unit's Size. Size 0 becomes Size 1 for this.",
            func : (rowId) => {
                let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
                if(sizeVal === 0){
                    sizeVal++;
                }
                return sizeVal + 2;
            },
            reqs : (rowId) => {
                return '';
            }
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