/*
    Core Unit cost calculator function.

    Unit Builder Rules v0.036

        Core Stat Equations, TAGS are elsewhere.

        these are distinct from the unitbuilder bindings to make them accessible anywhere.
*/
function uc_calc_Size(sizeVal){
    return sizeVal * 2;
}

function uc_calc_Move(moveVal, sizeVal){
    return (moveVal / 2) * sizeVal;
}

function uc_calc_Evade(evadeVal){
    return evadeVal * 2;
}

function uc_calc_Damage_Melee(meleeDamageVal, moveVal, sizeVal){
    if(meleeDamageVal === 0){
        return 0;
    }
    return (meleeDamageVal * 2) + ( (moveVal/ 4)  - (sizeVal / 2));
}

function uc_calc_Damage_Range(rangeDamageVal){
    return rangeDamageVal * 4;
}

function uc_calc_Range(moveVal, rangeVal, rangeDamageVal){
    if(rangeVal === 0){
        return 0;
    }
    return (moveVal / 2) + (rangeVal - 16) + rangeDamageVal;
}

function uc_calc_Armor(armorVal, sizeVal){
    if(armorVal === 0){
        return 0;
    }
    return (armorVal * 4) - sizeVal;
}

function uc_calc_Structure(structVal){
    return structVal;
}

function uc_calc_baseCost(sizeCost, moveCost, evadeCost, meleeCost, rangeDamageCost, rangeCost, armorCost, structCost){
    return sizeCost + moveCost + evadeCost +  meleeCost +  rangeDamageCost +  rangeCost +  armorCost +  structCost;
}