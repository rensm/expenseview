function getFieldValue(fieldName)
{
    var field = document.getElementById(fieldName);
    if(field){ return field.value; }
    else { return ""; }            
}

function setFieldValue(fieldName, fieldValue)
{
    var field = document.getElementById(fieldName);
    if(field){ field.value = fieldValue; }
}

function clearField(field, valueToClear) 
{
    if (field.value === valueToClear) {
        field.value = "";
    }
}

function setFieldText(field, valueToSet) {
    if (field.value === '') {
        field.value = valueToSet;
    }
}