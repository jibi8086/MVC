/*
 * Created By:-  Jibin Joseph
 * Created On :- 18-Dec-2018
 */

$REVISION = 1.0;

var iClickSubmit = 0;
var iClickOnce = 0;
var ObjOrgUnitHoliday = "";
var ObjOrgUnitSchedule = "";
var UserObj = new Object();
var ObjMultiRolesDetails = new Object();
var USER_ROLE_ID = new Array();
var RoleID = new Array();
var STATUSVAL = new Array();
var times = "00:00:00";
var ObjMultischeduleDetails = new Object();
var ObjMultiHolidayDetails = new Object();
var OrgUnitId = 0;
var queryOrgUnitId = 0;
var tableOrgUnitSchedule = "";
var tableOrgunitHoliday = "";
var empId = 0;
var ParentUnit = 0;
var hdnId = 0;
var parentValId = -2;
var tReturnOrgDetails = "";
var mergedUnitId;
var mergedStatusDate = "";
var mergedOrgUnitId = 0;
var AuthorizationStatus = 0;
var gridValidation = "";
var queryStrMode = null;
var orgStatus = 0;
var compareTime = 0;
var BeforeDate = "";
var AfterDate = "";
var pinCodeCountry = "";
var hasPinCode = false;
var hdnPinCode = 0;
var ddlChangeEventLastValues = [];


$.OrgUnitCreation = {};
$.Units = $.extend({}, $.Units);
var Alert = "Alert";
var sysDate = "";
var UserId;
var CompanyId;
var _payLoad;
var orgLevelResultSet;

//#region Controls to be handled in view

var ERROR_CLASS = "invalid";
var ddlOrgLevel = $("#ddlOrgLevel");
var ddlBranchType = $("#ddlBranchType");
//var ddlBranchType = $("#ddlUnitType");
var txtOrgName = $("#txtOrgName");
var txtOrgCode = $("#txtOrgCode");
var txtStreet = $("#txtStreet");
var txtLandmark = $("#txtLandmark");
var txtNameOfBuilding = $("#txtNameOfBuilding");
var ddlCountry = $("#ddlCountry");
var txtZipcode = $("#txtZipcode");
var txtPbNo = $("#txtPbNo");
var txtPostOffice = $("#txtPostOffice");
var ddlIsland = $("#ddlIsland");
var ddlDistrict = $("#ddlDistrict");
var ddlVillage = $("#ddlVillage");
var txtPhoneNumber = $("#txtPhoneNumber");
var txtAlternatePhoneNo = $("#txtAlternatePhoneNo");
var txtEmail = $("#txtEmail");
var ddlLocationClassification = $("#ddlLocationClassification");
var ddlParentUnit = $("#ddlParentUnit");
var txtUnitOpeningDate = $("#txtUnitOpeningDate");
var txtUnitInCharge = $("#txtUnitInCharge");
var ddlStatus = $("#ddlStatus");
var txtStatusDate = $("#txtStatusDate");
var txtUnit = $("#txtUnit");
var txtUnitCode = $("#txtUnitCode");
var ddlWeekDays = $("#ddlWeekDays");
var ddlNature = $("#ddlNature");
var ddlOccurence = $("#ddlOccurence");
var ddlOccurenceSchedule = $("#ddlOccurenceSchedule");
var ddlWorkingDay = $("#ddlWorkingDay");
var txtFromHour = $("#txtFromHour");
var txtToHour = $("#txtToHour");
var btnSave = $("#btnSave");
var btnAddHoliday = $("#btnAddHoliday");
var btnAddSchedule = $("#btnAddSchedule");
var txtEmail = $("#txtEmail");
var btnClear = $("#btnClear");
var grdOrgHoliday = $("#grdOrgHoliday");
var grdOrgUnitWorkingSchedule = $("#grdOrgUnitWorkingSchedule");
var ModalStaff = $("#ModalStaff");
var btnApprove = $("#btnApprove");
var btnClose = $("#btnClose");
var btnUpdate = $("#btnUpdate");
var txtUnitName = $("#txtUnitName");
var txtMergedUnitCode = $("#txtMergedUnitCode");
//region DropDown


var objOrgUnitPlugin = {
    SearchForOrgLevelId: $.emsyne.Utility.getGlobalValueByParamId(3),
    IsMultiSelect: false,
    OKEvent: "$.OrgUnitCreation.OnUnitPluginOkClick()",
    PluginAsModal: true,
    ParentDivId: "divOrgUnit"
}
$.OrgUnitCreation.OnUnitPluginOkClick = function () {

    var SelectedUnits = objOrgUnitPlugin.SelectedUnits;
    $('#divMergedUnitCode').show();
    for (var j = 0; j < objOrgUnitPlugin.SelectedUnits.length; j++) {

        mergedUnitId = objOrgUnitPlugin.SelectedUnits[j].ORG_UNIT_ID;
        $('#txtMergedUnitCode').val(objOrgUnitPlugin.SelectedUnits[j].UNIT_CODE);
        $('#txtUnitName').val(objOrgUnitPlugin.SelectedUnits[j].UNIT_NAME);
    }
}
$.OrgUnitCreation.BindOrgLevel = function (ddl, status) {


    var options = {
        controlID: [ddl],
        webMethod: FillOrgLevels,
        resultSetRequired: true,
        parameter: `{'status':${status}}`,
        textField: 'ORG_LEVEL_NAME',
        valueField: 'ORG_LEVEL_ID',
        isAsync: false,
        hasDefaultText: true,
        selectedValue: '0',
        defaultText: "<--Select-->"
    }
    $.emsyne.Utility.fillDropDown(options);


    $(ddl).selectpicker("refresh");

    if (options.resultSetRequired) {
        orgLevelResultSet = options.resultSet;

    }
}
$.OrgUnitCreation.BindBranchType = function () {
    $.emsyne.Utility.fillDropDown({
        controlID: ['#ddlBranchType'],
        webMethod: "/ServerPages/Common/frmCommonMethods.aspx/getEnumList",
        parameter: "{'enumName':'BranchType'}",
        isEnum: true,
        isAsync: false,
        hasDefaultId: 0
    });
    $(ddlBranchType).selectpicker("refresh");
}
$.OrgUnitCreation.BindWeekDay = function (ddl) {
    $.emsyne.Utility.fillDropDown({
        controlID: [ddl],
        webMethod: "/ServerPages/Common/frmCommonMethods.aspx/getEnumList",
        parameter: "{'enumName':'Days'}",
        isEnum: true,
        isAsync: false,
        hasDefaultId: -1
    });
    $(ddl).selectpicker("refresh");
}
$.OrgUnitCreation.BindNature = function (ddl) {
    $.emsyne.Utility.fillDropDown({
        controlID: [ddl],
        webMethod: "/ServerPages/Common/frmCommonMethods.aspx/getEnumList",
        parameter: "{'enumName':'Nature'}",
        isEnum: true,
        isAsync: false,
        hasDefaultId: -1
    });
    $(ddl).selectpicker("refresh");
}
$.OrgUnitCreation.BindOccurence = function (ddl) {
    $.emsyne.Utility.fillDropDown({
        controlID: [ddl],
        webMethod: "/ServerPages/Common/frmCommonMethods.aspx/getEnumList",
        parameter: "{'enumName':'Occurrence'}",
        isEnum: true,
        isAsync: false,
        hasDefaultText: false
        //hasDefaultId: -1
    });
    $(ddl).selectpicker("refresh");
}
//$.OrgUnitCreation.dataBindToOrgUnitHolidayGrid();
$.OrgUnitCreation.BindOccurenceSchedule = function () {
    $.emsyne.Utility.fillDropDown({
        controlID: ['#ddlOccurenceSchedule'],
        webMethod: "/ServerPages/Common/frmCommonMethods.aspx/getEnumList",
        parameter: "{'enumName':'Occurrence'}",
        isEnum: true,
        isAsync: false,
        hasDefaultText: true,
        defaultText: "All"
    });
    $(ddlOccurenceSchedule).selectpicker("refresh");
}
$.OrgUnitCreation.fnBindIsland = function () {

    var countryID = ddlCountry.val();
    $.OrgUnitCreation.BindIslandDropdown('#ddlIsland', 1, countryID); // Island
    $('#ddlIsland').selectpicker({
        liveSearchStyle: 'startsWith'
    });
    $('#ddlIsland').selectpicker("refresh");

}
$.OrgUnitCreation.fnBindDistrict = function () {

    var stateId = ddlIsland.val();
    $.OrgUnitCreation.BindDistrictDropdown('#ddlDistrict', stateId, 1);  // District
    $('#ddlDistrict').selectpicker({
        liveSearchStyle: 'startsWith'
    });
    $('#ddlDistrict').selectpicker("refresh");
}
$.OrgUnitCreation.BindLocationClassificationDropdown = function (status) {

    var jData = {};

    var jsonstr = '{"Status": ' + status + '}';
    jData.jsonFilter = jsonstr;
    jData.masterType = "LOCATION_CLASSIFICATION";
    var jsonFilter = JSON.stringify(jData);

    $.emsyne.Utility.fillDropDown({
        controlID: ["#ddlLocationClassification"],
        webMethod: MasterValueUrl,
        parameter: jsonFilter,
        textField: 'LOCATION_NAME',
        valueField: 'LOCATION_ID',
        isAsync: false,
        hasDefaultText: true,
        selectedValue: '0',
        defaultText: (status == -1 ? "All" : "<--Select-->")
    });
    $("#ddlLocationClassification").selectpicker("refresh");
}


$.OrgUnitCreation.fnBindVillage = function () {

    var districtId = ddlDistrict.val();
    var stateId = ddlIsland.val();
    $.OrgUnitCreation.BindVillageDropdown('#ddlVillage', stateId, districtId, 1);  // Village
    $('#ddlVillage').selectpicker({
        liveSearchStyle: 'startsWith'
    });
    $('#ddlVillage').selectpicker("refresh");
}


$.OrgUnitCreation.BindCountryDropdown = function (ddl, status) {

    var bindCountry = {
        controlID: [ddl],
        webMethod: GetAllCountriesUrl,
        parameter: `{'status':${status}}`,
        textField: 'COUNTRY_NAME',
        valueField: 'COUNTRY_ID',
        isAsync: false,
        hasDefaultText: false,
        resultSetRequired: true
    }
    $.emsyne.Utility.fillDropDown(bindCountry);
    countryResult = bindCountry.resultSet;

    $(ddl).selectpicker("refresh");
}
$.OrgUnitCreation.BindVillageDropdown = function (ddl, stateid, districtid, status) {
    $.emsyne.Utility.fillDropDown({
        controlID: [ddl],
        webMethod: GetAllVillagesUrl,
        parameter: `{'stateid':${stateid}, 'districtid':${districtid}, 'Status':${status}}`,
        textField: 'VILLAGE_NAME',
        valueField: 'VILLAGE_ID',
        isAsync: false,
        hasDefaultText: true,
        selectedValue: '0',
        defaultText: "<--Select-->"
    });
    $(ddl).selectpicker("refresh");
}
$.OrgUnitCreation.BindIslandDropdown = function (ddl, status, countryId) {
    $.emsyne.Utility.fillDropDown({
        controlID: [ddl],
        webMethod: GetAllIslandsUrl,
        parameter: `{'status':${status}, 'countryid':${countryId}}`,
        textField: 'STATE_NAME',
        valueField: 'STATE_ID',
        isAsync: false,
        hasDefaultText: true,
        selectedValue: '0',
        defaultText: (status == -1 ? "All" : "<--Select-->")
    });
    $(ddl).selectpicker("refresh");
}
$.OrgUnitCreation.BindDistrictDropdown = function (ddl, stateid, status) {
    $.emsyne.Utility.fillDropDown({
        controlID: [ddl],
        webMethod: GetAllDistrictsUrl,
        parameter: `{'stateid':${stateid}, 'status':${status}}`,
        textField: 'DISTRICT_NAME',
        valueField: 'DISTRICT_ID',
        isAsync: false,
        hasDefaultText: true,
        selectedValue: '0',
        defaultText: "<--Select-->"
    });
    $(ddl).selectpicker("refresh");
}

$.OrgUnitCreation.BindParentUnit = function (ddl, OrgLevelId) {
    var orgParentId;
    for (var i = 0; i < orgLevelResultSet.length; i++) {
        if (orgLevelResultSet[i].ORG_LEVEL_ID == ddlOrgLevel.val() && (i - 1) != -1) {
            //  $(ddl).attr("enabled", "enabled");
            parentValId = 0;
            $(ddl).removeAttr('disabled');
            $('#ddlParentUnit').prop('disabled', false);
            orgParentId = orgLevelResultSet[i - 1].ORG_LEVEL_ID;
            var options = {
                controlID: [ddl],
                webMethod: FillOrgUnitsByLevelId,
                parameter: '{"Level": "' + orgParentId + '","UnitId":"0","name_startsWith":"","Code_startsWith":"", "BranchType" :"-1"}',
                textField: "UNIT_NAME",
                valueField: "ORG_UNIT_ID",
                isAsync: false

            }

            $.emsyne.Utility.fillDropDown(options);
            $(ddl).selectpicker("refresh");
        }
        else {
            ///$('#ddlParentUnit').prop('disabled', true);

        }
        if ((i - 1) == -1) {
            parentValId = -1;
            $('#ddlParentUnit').val('0');
            $('#ddlParentUnit').selectpicker('refresh');
            $(ddl).attr("disabled", "disabled");
        }
    }

}

$.OrgUnitCreation.BindStatus = function () {
    $.emsyne.Utility.fillDropDown({
        controlID: ['#ddlStatus'],
        webMethod: "/ServerPages/Common/frmCommonMethods.aspx/getEnumList",
        parameter: "{'enumName':'UnitStatus'}",
        isEnum: true,
        isAsync: false,
        hasDefaultText: false,
    });
    $(ddlStatus).selectpicker("refresh");
}
//region End DropDown

$.OrgUnitCreation.ClearHasErrorClass = function () {

    if ($('#ddlOrgLevel').parent().find('button').hasClass(ERROR_CLASS)) {
        $('#ddlOrgLevel').parent().find('button').removeClass(ERROR_CLASS);
    }
    if ($('#ddlBranchType').parent().find('button').hasClass(ERROR_CLASS)) {
        $('#ddlBranchType').parent().find('button').removeClass(ERROR_CLASS);
    }
    if ($('#ddlCountry').parent().find('button').hasClass(ERROR_CLASS)) {
        $('#ddlCountry').parent().find('button').removeClass(ERROR_CLASS);
    }
    if ($('#ddlIsland').parent().find('button').hasClass(ERROR_CLASS)) {
        $('#ddlIsland').parent().find('button').removeClass(ERROR_CLASS);
    }
    if ($('#ddlDistrict').parent().find('button').hasClass(ERROR_CLASS)) {
        $('#ddlDistrict').parent().find('button').removeClass(ERROR_CLASS);
    }
    if ($('#ddlVillage').parent().find('button').hasClass(ERROR_CLASS)) {
        $('#ddlVillage').parent().find('button').removeClass(ERROR_CLASS);
    }
    if ($('#ddlLocationClassification').parent().find('button').hasClass(ERROR_CLASS)) {
        $('#ddlLocationClassification').parent().find('button').removeClass(ERROR_CLASS);
    }
    if ($('#ddlParentUnit').parent().find('button').hasClass(ERROR_CLASS)) {
        $('#ddlParentUnit').parent().find('button').removeClass(ERROR_CLASS);
    }
    if ($('#ddlBranchType').parent().find('button').hasClass(ERROR_CLASS)) {
        $('#ddlBranchType').parent().find('button').removeClass(ERROR_CLASS);
    }
    $('#ddlOrgLevel').removeClass("invalid");
    $('#ddlBranchType').removeClass("invalid");
    $('#txtOrgName').removeClass("invalid");
    $('#txtOrgCode').removeClass("invalid");
    $('#txtStreet').removeClass("invalid");
    $('#txtNameOfBuilding').removeClass("invalid");
    $('#ddlCountry').removeClass("invalid");
    $('#ddlIsland').removeClass("invalid");
    $('#ddlDistrict').removeClass("invalid");
    $('#ddlVillage').removeClass("invalid");
    $('#txtPostOffice ').removeClass("invalid");
    $('#ddlLocationClassification').removeClass("invalid");
    $('#ddlParentUnit').removeClass("invalid");
    $('#txtUnitInCharge').removeClass("invalid");
    $('#txtMergedUnitCode').removeClass("invalid");
    $('#txtUnitName').removeClass("invalid");
    $('#txtStatusDate').removeClass("invalid");
    $('#txtZipcode').removeClass("invalid");
};
$.OrgUnitCreation.ClearHasHolidayErrorClass = function () {
    $("button[data-id=ddlWeekDays]").removeClass(ERROR_CLASS);
    $("button[data-id=ddlNature]").removeClass(ERROR_CLASS);
    $("button[data-id=ddlOccurence]").removeClass(ERROR_CLASS);
};

$.OrgUnitCreation.ClearHasScheduleErrorClass = function () {
    $("button[data-id=ddlWorkingDay]").removeClass(ERROR_CLASS);
    $("button[data-id=ddlOccurenceSchedule]").removeClass(ERROR_CLASS);
    $('#txtFromHour').removeClass("invalid");
    $('#txtToHour').removeClass("invalid");
};

$.OrgUnitCreation.fnClearControls = function () {

    ddlCountry.val('0');
    ddlCountry.selectpicker('refresh');
    ddlIsland.val('0');
    ddlIsland.selectpicker('refresh');
    ddlDistrict.val('0');
    ddlDistrict.selectpicker('refresh');
    ddlVillage.val('0');
    ddlVillage.selectpicker('refresh');
    txtOrgName.val('');
    txtStreet.val('');
    txtLandmark.val('');
    txtZipcode.val('');
    txtPbNo.val('');
    txtNameOfBuilding.val('');
    txtOrgCode.val('');
    txtPostOffice.val('');
    txtPhoneNumber.val('');
    txtAlternatePhoneNo.val('');
    txtEmail.val('');
    txtUnitInCharge.val('');
    //txtUnitOpeningDate.val('00:00');
    ddlOrgLevel.val('0');
    ddlOrgLevel.selectpicker('refresh');
    ddlBranchType.val('0');
    ddlBranchType.selectpicker('refresh');
    ddlWeekDays.val('0');
    ddlWeekDays.selectpicker('refresh');
    ddlNature.val('0');
    ddlNature.selectpicker('refresh');
    ddlOccurence.val('0');
    ddlOccurence.selectpicker('refresh');
    $.OrgUnitCreation.ClearHasErrorClass();

    $.OrgUnitCreation.fnHolidayClearControls();
    $.OrgUnitCreation.fnScheduleClearControls();
    $.OrgUnitCreation.ClearHasHolidayErrorClass();
    $.OrgUnitCreation.ClearHasScheduleErrorClass();
}
$.OrgUnitCreation.fnValidate = function () {
    var hasError = false;
    var controlToFocus = "";
    $.OrgUnitCreation.ClearHasErrorClass();


    if ($.emsyne.Utility.GetNumericValue(ddlIsland.val()) == "0") {
        $("button[data-id=ddlIsland]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlIsland]";
    }
    if ($.trim(txtOrgName.val()) == "") {
        txtOrgName.addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "#txtOrgName";
    }
    if ($.trim(txtOrgCode.val()) == "") {
        txtOrgCode.addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "#txtOrgCode";
    }

    if ($.trim(txtPostOffice.val()) == "") {
        txtPostOffice.addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "#txtPostOffice";
    }
    if ($.trim(txtZipcode.val()) == "") {
        txtZipcode.addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "#txtZipcode";
    }
    if ($.emsyne.Utility.GetNumericValue(ddlOrgLevel.val()) == "0") {
        $("button[data-id=ddlOrgLevel]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlOrgLevel]";
    }
    if ($.emsyne.Utility.GetNumericValue(ddlCountry.val()) == "0") {
        $("button[data-id=ddlCountry]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlCountry]";
    }
    if ($.emsyne.Utility.GetNumericValue(ddlDistrict.val()) == "0") {
        $("button[data-id=ddlDistrict]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlDistrict]";
    }
    if ($.emsyne.Utility.GetNumericValue(ddlVillage.val()) == "0") {
        $("button[data-id=ddlVillage]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlVillage]";
    }
    if ($.emsyne.Utility.GetNumericValue(ddlLocationClassification.val()) == "0") {
        $("button[data-id=ddlLocationClassification]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlLocationClassification]";
    }
    if (($.emsyne.Utility.GetNumericValue(ddlParentUnit.val()) == "0") && parentValId != -1) {
        $("button[data-id=ddlParentUnit]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlParentUnit]";
    }

    if ($.trim(txtUnitOpeningDate.val()) == "") {
        txtUnitOpeningDate.addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "#txtUnitOpeningDate";
    }
    if ($.trim($('#txtPhoneNumber').val()) != "") {
        if ($.trim($('#txtPhoneNumber').val()).length < 8) {
            $('#txtPhoneNumber').removeClass("form-group");
            $('#txtPhoneNumber').addClass("invalid");
            $.UserManagement.fnShowAlert("Min 8 Digits for Mobile number");
            return false;
        }
        else
            $('#txtPhoneNumber').removeClass("invalid");
    }
    else
        $('#txtPhoneNumber').removeClass("invalid");
    if (queryOrgUnitId != 0) {
        if ($.trim(txtUnitInCharge.val()) == "") {
            txtUnitInCharge.addClass(ERROR_CLASS);
            hasError = true;
            if (controlToFocus == "")
                controlToFocus = "#txtUnitInCharge";
        }
    }
    //if (queryOrgUnitId != 0) {
    //    if ($.emsyne.Utility.GetNumericValue(ddlStatus.val()) == "0") {
    //        $("button[data-id=ddlStatus]").addClass(ERROR_CLASS);
    //        hasError = true;
    //        if (controlToFocus == "")
    //            controlToFocus = "button[data-id=ddlStatus]";
    //    }
    //}
    if (ddlStatus.val() == 17) {
        if ($.trim(txtStatusDate.val()) == "") {
            txtStatusDate.addClass(ERROR_CLASS);
            hasError = true;
            if (controlToFocus == "")
                controlToFocus = "#txtStatusDate";
        }
    }
    else if (ddlStatus.val() == 16) {
        if ($.trim(txtStatusDate.val()) == "") {
            txtStatusDate.addClass(ERROR_CLASS);
            hasError = true;
            if (controlToFocus == "")
                controlToFocus = "#txtStatusDate";
        }
        if ($.trim(txtUnitName.val()) == "") {
            txtUnitName.addClass(ERROR_CLASS);

            hasError = true;
            if (controlToFocus == "")
                controlToFocus = "#txtUnitName";

        }
        if ($.trim(txtMergedUnitCode) == "") {
            txtMergedUnitCode.addClass(ERROR_CLASS);
            hasError = true;
            if (controlToFocus == "")
                controlToFocus = "#txtMergedUnitCode";
        }

    }
    if (ddlOrgLevel.val() == $.emsyne.Utility.getGlobalValueByParamId(3)) {
        if ($.emsyne.Utility.GetNumericValue(ddlBranchType.val()) == "0") {
            $("button[data-id=ddlBranchType]").addClass(ERROR_CLASS);
            hasError = true;
            if (controlToFocus == "")
                controlToFocus = "button[data-id=ddlBranchType]";
        }
    }

    if (hasError) {
        iClickOnce = 0;
        $.emsyne.Utility.ShowMessage(cm054, Alert, controlToFocus);
        if (!$("#collapseOne").hasClass("in")) {
            $("#headingOne").click();
        }

    }
    iClickSubmit = 0;
    return hasError;
}
$("#lnkEmployeeSearch").click(function () {

    if (queryStrMode != 2) {
        $.emp.EmpSearchPlugin.getEmpSearchPlugin({
            divID: '#ModalStaff',
            OrgUnitId: queryOrgUnitId,
            eventOnOKClick: '$.OrgUnitCreation.SelectUnitInCharge()'
        });
    }
    return false;
});
$("#lnkUnitSearch").click(function () {
    if (queryStrMode != 2) {
        $.Units.UnitSearchPlugin(objOrgUnitPlugin);
    }
    return false;

    //var SelectedUnits = objOrgUnitPlugin.SelectedUnits;
});


$.OrgUnitCreation.SelectUnitInCharge = function () {
    empId = selectedEmpPlugin[0];
    txtUnitInCharge.val(selectedEmpPlugin[2]);
    ModalStaff.modal("hide");

}
$.OrgUnitCreation.fnValidateEmail = function (emailId, control) {

    var options = {
        paramEmail: emailId,
        isAlertRequired: true,
        alertMessage: cm020,
        controlName: control
    };

    var isValidEmail = $.emsyne.Utility.isEmailValid(options);
    return isValidEmail;

}

$.OrgUnitCreation.fnValidateUnitName = function (unitName, control) {
    var tOrgUnitMaster = new OrgUnitCreationMaster();
    if (tReturnOrgDetails != "" && tReturnOrgDetails.ResultSet0 != undefined && tReturnOrgDetails.ResultSet0.ResultSet[0].UNIT_NAME != $.trim(txtOrgName.val())) {
        var tReturn = tOrgUnitMaster.GetOrgUnitName(unitName);
        if (tReturn.ResultSet[0].Column1 > 0) {
            $.emsyne.Utility.ShowMessage(EM023, Alert, control);
            txtOrgName.val('');
        }
    }
    else if (queryOrgUnitId == 0) {
        var tReturn = tOrgUnitMaster.GetOrgUnitName(unitName);
        if (tReturn.ResultSet[0].Column1 > 0) {
            $.emsyne.Utility.ShowMessage(EM023, Alert, control);
            txtOrgName.val('');
        }
    }
}

$.OrgUnitCreation.fnValidateUnitCode = function (unitCode, control) {
    var tOrgUnitMaster = new OrgUnitCreationMaster();
    if (tReturnOrgDetails != "" && tReturnOrgDetails.ResultSet0 != undefined && tReturnOrgDetails.ResultSet0.ResultSet[0].UNIT_CODE != $.trim(txtOrgCode.val())) {
        var tReturn = tOrgUnitMaster.GetOrgUnitCode(unitCode);
        if (tReturn.ResultSet[0].Column1 > 0) {
            $.emsyne.Utility.ShowMessage(EM024, Alert, control);
            txtOrgCode.val('');
        }
    }
    else if (queryOrgUnitId == 0) {
        var tReturn = tOrgUnitMaster.GetOrgUnitCode(unitCode);
        if (tReturn.ResultSet[0].Column1 > 0) {
            $.emsyne.Utility.ShowMessage(EM024, Alert, control);
            txtOrgCode.val('');
        }
    }
}
$.OrgUnitCreation.dataBindToOrgUnitHolidayGrid = function () {
    //if ($.fn.DataTable.isDataTable('#grdOrgHoliday')) {
    //    ObjOrgUnitHoliday.destroy(); 
    //}

    ObjOrgUnitHoliday = grdOrgHoliday.DataTable({
        "filter": false,
        "scrollY": 200,
        "orderClasses": false,
        "columnDefs": [{ visible: false, targets: [0] }],
        "ordering": true,
        "paging": false,
        "bProcessing": true,
        "bServerSide": false,
        "info": true,
        "dom": '<"top">rt<"bottom"Bpfli><"clear">',
        "oLanguage": {
            "sLengthMenu": "_MENU_",
            "sInfoEmpty": "<span tkey='View 0 to 0 of 0 entries'>View 0 to 0 of 0 entries</span>",
            "sInfo": "<span tkey='View'>View</span> _START_ <span tkey='to'>to</span> _END_ <span tkey='of'>of</span> _TOTAL_",
            "oPaginate": {
                "sPrevious": "<span tkey='Previous'>Previous</span>",
                "sNext": "<span tkey='Next'>Next</span>"
            }
        },
        buttons: [
            {
                text: '<i class=""></i><span class="grid_button pAdd"  >Delete</span>',
                action: function (e, dt, node, config) {
                    if (queryStrMode != 2) {
                        var ids = $.map(ObjOrgUnitHoliday.rows('.selected').data(), function (item) {
                            return item[0];
                        });
                        if (ids.length > 0) {
                            bootbox.confirm({
                                message: cm068,
                                title: "Confirm",
                                callback: function (result) {
                                    if (result == true) {

                                        var table = $('#grdOrgHoliday').DataTable();
                                        var selectedRow = ObjOrgUnitHoliday.rows('.selected').data();
                                        for (var i = 0; i < selectedRow.length; i++) {
                                            table.row('.selected').remove().draw(false);
                                        }
                                        //var selectedRow = grdOrgHoliday.rows('.selected').data();

                                        iClickOnce = 0;
                                        iClickSubmit = 0;
                                        $(".bootbox-alert").modal('hide');
                                    }
                                    else {
                                        $(".bootbox-confirm").modal('hide');
                                        iClickSumbit = 0;
                                    }
                                }
                            });
                        }
                        else {
                            bootbox.alert({
                                message: cm081,
                                title: "Alert",
                                callback: function () {
                                    $(".bootbox-alert").modal('hide');
                                    return false;
                                }
                            });
                            return false;
                        }
                    }



                }
            },


        ],
    });
}
$.OrgUnitCreation.dataBindToOrgUnitWorkingSchedule = function () {

    //if ($.fn.DataTable.isDataTable('#grdOrgUnitWorkingSchedule')) {

    //    ObjOrgUnitSchedule.destroy();
    //}

    ObjOrgUnitSchedule = grdOrgUnitWorkingSchedule.DataTable({
        "filter": false,
        "scrollY": 200,
        "orderClasses": false,
        "columnDefs": [{ visible: false, targets: [0] }],
        "ordering": true,
        "paging": false,
        "bProcessing": true,
        "bServerSide": false,
        "info": true,
        "dom": '<"top">rt<"bottom"Bpfli><"clear">',
        "oLanguage": {
            "sLengthMenu": "_MENU_",
            "sInfoEmpty": "<span tkey='View 0 to 0 of 0 entries'>View 0 to 0 of 0 entries</span>",
            "sInfo": "<span tkey='View'>View</span> _START_ <span tkey='to'>to</span> _END_ <span tkey='of'>of</span> _TOTAL_",
            "oPaginate": {
                "sPrevious": "<span tkey='Previous'>Previous</span>",
                "sNext": "<span tkey='Next'>Next</span>"
            }
        },
        buttons: [
            {

                text: '<i class="fa fa-delete"></i><span class="grid_button pAdd" >Delete</span>',
                action: function (e, dt, node, config) {


                    if (queryStrMode != 2) {
                        var ids = $.map(ObjOrgUnitSchedule.rows('.selected').data(), function (item) {
                            return item[0];
                        });
                        if (ids.length > 0) {
                            bootbox.confirm({
                                message: cm068,
                                title: "Confirm",
                                callback: function (result) {
                                    if (result == true) {

                                        var table = $('#grdOrgUnitWorkingSchedule').DataTable();
                                        var selectedRow = ObjOrgUnitSchedule.rows('.selected').data();
                                        for (var i = 0; i < selectedRow.length; i++) {
                                            table.row('.selected').remove().draw(false);
                                        }
                                        //var selectedRow = grdOrgHoliday.rows('.selected').data();

                                        iClickOnce = 0;
                                        iClickSubmit = 0;
                                        $(".bootbox-alert").modal('hide');

                                    }
                                    else {
                                        $(".bootbox-confirm").modal('hide');
                                        iClickSumbit = 0;
                                    }
                                }
                            });
                        }
                        else {
                            bootbox.alert({
                                message: cm081,
                                title: "Alert",
                                callback: function () {
                                    $(".bootbox-alert").modal('hide');
                                    return false;
                                }
                            });
                            return false;

                        }
                    }
                }
            },


        ],
    });
}

$.OrgUnitCreation.fnFillDetails = function (tReturn) {
    //if ($.fn.DataTable.isDataTable('#grdOrgHoliday')) {
    //    ObjOrgUnitHoliday.destroy(); 
    //}

    $.emsyne.Utility.initializeDatePickerWithExtendedParams("#txtUnitOpeningDate", false, '-1M', sysDate, "-1:+1");
    $('#ddlStatus').show();
    ObjOrgUnitSchedule.clear();
    ObjOrgUnitHoliday.clear();

    var OrgDetl1;
    var OrgDetl2;
    var OrgDetl3;


    OrgDetl1 = tReturn.ResultSet0.ResultSet[0];
    OrgDetl2 = tReturn.ResultSet1.ResultSet1;
    OrgDetl3 = tReturn.ResultSet2.ResultSet2;


    //$.OrgUnitCreation.BindOrgLevel('#ddlOrgLevel', -1);   
    //ddlOrgLevel.selectpicker('refresh');

    if (OrgDetl1 != null && OrgDetl1 != undefined) {
        $.OrgUnitCreation.BindBranchType();
        ddlBranchType.selectpicker('refresh');


        txtOrgName.val(OrgDetl1.UNIT_NAME);
        txtOrgCode.val(OrgDetl1.UNIT_CODE);
        txtStreet.val(OrgDetl1.ADDRESS2);
        txtLandmark.val(OrgDetl1.ADDRESS3);
        txtNameOfBuilding.val(OrgDetl1.ADDRESS1);

        txtZipcode.val(OrgDetl1.POSTAL_ID);
        txtPbNo.val(OrgDetl1.POST_BOX_NO);
        txtPostOffice.val(OrgDetl1.POST_OFFICE);
        txtPhoneNumber.val(OrgDetl1.MOBILE);
        txtAlternatePhoneNo.val(OrgDetl1.LANDPHONE_NO);
        txtEmail.val(OrgDetl1.EMAIL);
        var openingDate = $.emsyne.Utility.getSerializedDate(OrgDetl1.OPENING_DATE, 'mm/dd/yy', 'dd/mm/yy');
        txtUnitOpeningDate.val(openingDate);
        txtUnitInCharge.val(OrgDetl1.DISPLAY_NAME);
        empId = OrgDetl1.UNIT_IN_CHARGE_ID;
        txtEmail.val(OrgDetl1.EMAIL);

        //txtUnit.val(OrgDetl1.);
        //txtUnitCode.val(OrgDetl1.);




        orgStatus = OrgDetl1.STATUS;

        if (OrgDetl1.STATUS == 16) {
            $('#divStatusDate').show();
            $('#divMergedUnitCode').show();
            $('#divOrgUnitName').show();

            $("#txtUnitName").val(OrgDetl1.MERGED_UNIT_NAME);
            $("#txtMergedUnitCode").val(OrgDetl1.MERGED_UNIT_CODE);
            var statusDate = $.emsyne.Utility.getSerializedDate(OrgDetl1.LIVE_DATE, 'mm/dd/yy', 'dd/mm/yy');
            $("#txtStatusDate").val(statusDate);
        }
        else if (OrgDetl1.STATUS == 17) {
            $('#divStatusDate').show();
            var statusDate = $.emsyne.Utility.getSerializedDate(OrgDetl1.LIVE_DATE, 'mm/dd/yy', 'dd/mm/yy');
            $("#txtStatusDate").val(statusDate);

        }
        else {
            $('#divStatusDate').hide();
            $('#divMergedUnitCode').hide();
            $('#divOrgUnitName').hide();
        }
        if (OrgDetl1.ORG_LEVEL_ID == $.emsyne.Utility.getGlobalValueByParamId(3)) {
            $("#divBranchType").show();
            $('#ddlBranchType').val(OrgDetl1.UNIT_TYPE);
            $('#ddlBranchType').selectpicker('refresh');
        }
        else {
            $("#divBranchType").hide();
        }
        $('#ddlStatus').val(OrgDetl1.STATUS);
        $('#ddlStatus').selectpicker('refresh');

        $('#ddlOrgLevel').val(OrgDetl1.ORG_LEVEL_ID);
        $('#ddlOrgLevel').selectpicker('refresh');


        $.OrgUnitCreation.BindParentUnit('#ddlParentUnit', ddlOrgLevel.val());
        $('#ddlParentUnit').val(OrgDetl1.PARENT_UNIT_ID);
        $('#ddlParentUnit').selectpicker('refresh');


        $('#ddlLocationClassification').val(OrgDetl1.UNIT_LOCATION_ID);
        $('#ddlLocationClassification').selectpicker('refresh');




        $('#ddlCountry').val(OrgDetl1.COUNTRY_ID);
        $('#ddlCountry').selectpicker('refresh');

        $.OrgUnitCreation.fnBindIsland();
        $('#ddlIsland').val(OrgDetl1.STATE_ID);
        $('#ddlIsland').selectpicker('refresh');

        $.OrgUnitCreation.fnBindDistrict();
        $('#ddlDistrict').val(OrgDetl1.DISTRICT_ID);
        $('#ddlDistrict').selectpicker('refresh');

        $.OrgUnitCreation.fnBindVillage();
        $('#ddlVillage').val(OrgDetl1.VILLAGE_ID);
        $('#ddlVillage').selectpicker('refresh');
        $('#ddlIsland,#ddlDistrict,#ddlVillage').selectpicker("refresh");

    }



    tableOrgUnitSchedule = ObjOrgUnitSchedule;
    tableOrgunitHoliday = ObjOrgUnitHoliday;
    var fromTimes;
    var workingHour;
    var ToTimes;
    var DayName;
    var OccurenceName;
    var WorkingHourId;
    for (var j = 0; j < OrgDetl3.length; j++) {
        var fromhour = OrgDetl3[j].TIME_FROM.Hours;
        var toHour = OrgDetl3[j].TIME_TO.Hours;
        var fromMinutes = OrgDetl3[j].TIME_FROM.Minutes;
        var toMinutes = OrgDetl3[j].TIME_TO.Minutes;
        if (fromMinutes.toString().length == 1) {
            fromMinutes = "0" + fromMinutes;
        }
        if (toMinutes.toString().length == 1) {
            toMinutes = "0" + toMinutes;
        }
        if (fromhour.toString().length == 1) {
            fromhour = "0" + fromhour;
        }
        if (toHour.toString().length == 1) {
            toHour = "0" + toHour;
        }
        fromTimes = fromhour + ':' + fromMinutes;
        ToTimes = toHour + ':' + toMinutes;
        workingHour = fromTimes + ' - ' + ToTimes;
        DayName = $.OrgUnitCreation.FillGridDay(OrgDetl3[j].DAY_ID);
        OccurenceName = $.OrgUnitCreation.FillGridOccurence(OrgDetl3[j].OCCURRENCE);
        WorkingHourId = OrgDetl3[j].WORKING_HOUR_ID;


        tableOrgUnitSchedule.row.add([
            WorkingHourId,
            DayName,
            workingHour,
            OccurenceName,
        ]).draw(false);
    }



    var natureName;
    var DayName;
    var OccurenceName
    var HolidayId;
    for (var j = 0; j < OrgDetl2.length; j++) {
        OrgDetl2[0]
        DayName = $.OrgUnitCreation.FillGridDay(OrgDetl2[j].WEEKLY_HOLIDAY);
        OccurenceName = $.OrgUnitCreation.FillGridOccurence(OrgDetl2[j].OCCURRENCE);
        HolidayId = OrgDetl2[j].HOLIDAY_ID;
        switch (OrgDetl2[j].HOLIDAY_NATURE) {
            case 1:
                natureName = "Full Day";
                break;
            case 2:
                natureName = "Fore Noon";
                break;
            case 3:
                natureName = "After Noon";
                break;
        }


        tableOrgunitHoliday.row.add([
            HolidayId,
            DayName,
            natureName,
            OccurenceName,
        ]).draw(false);
    }




}
$.OrgUnitCreation.FillGridDay = function (dayId) {
    var DayType;
    switch (dayId) {
        case 1:
            DayType = "Sunday";
            break;
        case 2:
            DayType = "Monday";
            break;
        case 3:
            DayType = "Tuesday";
            break;
        case 4:
            DayType = "Wednesday";
            break;
        case 5:
            DayType = "Thursday";
            break;
        case 6:
            DayType = "Friday";
            break;
        case 7:
            DayType = "Saturday";
            break;
    }
    return DayType;
}
$.OrgUnitCreation.FillGridOccurence = function (OccurenceId) {
    var OccurenceType;
    switch (OccurenceId) {
        case 0:
            OccurenceType = "All";
            break;
        case 1:
            OccurenceType = "1ST";
            break;
        case 2:
            OccurenceType = "2nd";
            break;
        case 3:
            OccurenceType = "3rd";
            break;
        case 4:
            OccurenceType = "4th";
            break;
        case 5:
            OccurenceType = "5th";
            break;
    }
    return OccurenceType;

}




//#endregion 

$.OrgUnitCreation.fnSave = function (OrgLevelId, BranchTypeId, BranchName, BranchCode, BranchLandMark, Street, NameOfBuilding, CountryId, IslandName, DistrictId, VillageId,
    ZipCode, PbNo, PostOffice, PhoneNo, AlternatePhoneNo, EmailId, LocationId, UnitOpeningDate, ParentUnit, UnitInCharge, Status, StatusDate, Unit, UnitCode, _mergedOrgUnitId, _mergedStatusDate, AuthorizationStatus) {

    try {
        var tOrgUnitMaster = new OrgUnitCreationMaster();
        var OrgUnitObj = new Object();
        OrgUnitObj.OrgLevelId = OrgLevelId;
        OrgUnitObj.BranchTypeId = BranchTypeId;
        OrgUnitObj.BranchName = BranchName;
        OrgUnitObj.BranchCode = BranchCode;
        OrgUnitObj.BranchLandMark = BranchLandMark;
        OrgUnitObj.Street = Street;
        OrgUnitObj.NameOfBuilding = NameOfBuilding;
        OrgUnitObj.CountryId = CountryId;
        OrgUnitObj.StateId = IslandName;
        OrgUnitObj.DistrictId = DistrictId;
        OrgUnitObj.VillageId = VillageId;
        OrgUnitObj.ZipCode = ZipCode;
        OrgUnitObj.PostBoxNo = PbNo;
        OrgUnitObj.PostOfficeName = PostOffice;
        OrgUnitObj.MobileNo = PhoneNo;
        OrgUnitObj.AlternateContactNo = AlternatePhoneNo;
        OrgUnitObj.OfficialEmail = EmailId;
        OrgUnitObj.UnitLocationId = LocationId;
        OrgUnitObj.UnitOpeningDate = UnitOpeningDate;
        OrgUnitObj.ParentUnitId = ParentUnit;
        OrgUnitObj.UnitInCharge = UnitInCharge;
        OrgUnitObj.Status = Status;
        OrgUnitObj.StatusDate = StatusDate;
        // OrgUnitObj.Unit = Unit;
        // OrgUnitObj.UnitCode = UnitCode; 
        OrgUnitObj.EmpId = empId;
        OrgUnitObj.OrgUnitId = queryOrgUnitId;
        OrgUnitObj.MergedOn = _mergedStatusDate;
        OrgUnitObj.MergedUnitId = _mergedOrgUnitId;
        OrgUnitObj.AuthorizationStatusId = AuthorizationStatus;
        $.OrgUnitCreation.fnAddHoliday();
        $.OrgUnitCreation.fnAddSchedule();
        OrgUnitObj.ObjMultischeduleDetails = ObjMultischeduleDetails;
        OrgUnitObj.ObjMultiHolidayDetails = ObjMultiHolidayDetails;
        var stringifydata = JSON.stringify(OrgUnitObj);
        var tReturn = tOrgUnitMaster.SaveOrgUnit(stringifydata);

        if (tReturn.Value > 0) {

            var Mssg = '';
            //Mssg = (OrgUnitId == 0 ? cm003 : (operationId == 2 ? cm027 : cm005));
            Mssg = (queryOrgUnitId == 0 ? cm003 : cm027)
            bootbox.alert({
                message: Mssg,
                title: "Success",
                callback: function () {
                    iClickOnce = 0;
                    iClickSubmit = 0;
                    $(".bootbox-alert").modal('hide');
                    tbusrpIndex = 1;
                    $.emsyne.Utility.loadContentDiv("/Views/ADMS/Settings/frmOrgUnitListing.html");
                    $(location).attr("hash", $.rc4EncryptStr("#OrgUnit_ID=0&MODE=0", "20"));
                    return true;
                }
            });
        }
        else if (tReturn.Value == -1) {
            bootbox.alert({
                message: cm021, //"Error while saving the details..",
                title: "Duplicate",
                callback: function () {
                    iClickOnce = 0;
                    iClickSubmit = 0;
                    $(".bootbox-alert").modal('hide');
                    //ddlUserClassification.focus();
                    return false;
                }
            });

        }
        else {
            bootbox.alert({
                message: baseErrorMsg,
                title: "Error",
                callback: function () {
                    iClickOnce = 0;
                    iClickSubmit = 0;
                    $(".bootbox-alert").modal('hide');
                    //ddlUserClassification.focus();
                    return false;
                }
            });

        }
        //else {
        //    bootbox.alert({
        //        message: cm021, //"Error while saving the details..",
        //        title: "Duplicate",
        //        callback: function () {
        //            iClickOnce = 0;
        //            iClickSubmit = 0;
        //            return false;
        //        }
        //    });

        //}

    }
    catch (ex) { alert(ex); }


}
$.OrgUnitCreation.fnSubmit = function () {

    if (iClickSubmit == 0) {
        iClickSubmit = iClickSubmit + 1;
        if (!$.OrgUnitCreation.fnValidate()) {
            if (!$.OrgUnitCreation.fnValidateGridRecord()) {
                if (!$.OrgUnitCreation.ValidateMergedUnit()) {
                    bootbox.confirm({
                        message: cm002,
                        title: "Confirm",
                        callback: function (result) {
                            if (result == true) {
                                if (iClickOnce == 0) {
                                    var BranchTypeId;
                                    iClickOnce = iClickOnce + 1;
                                    var OrgLevelId = ddlOrgLevel.val();

                                    var BranchName = $.trim(txtOrgName.val().substr(0, 15).toUpperCase().replace(/'/g, '\\u0027')); //$.trim(txtOrgName.val());
                                    var BranchCode = $.trim(txtOrgCode.val().substr(0, 15).toUpperCase().replace(/'/g, '\\u0027')); //$.trim(txtOrgCode.val());
                                    var BranchLandMark = $.trim(txtLandmark.val());
                                    var Street = $.trim(txtStreet.val());
                                    var NameOfBuilding = $.trim(txtNameOfBuilding.val());
                                    var CountryId = ddlCountry.val();
                                    var IslandName = ddlIsland.val();
                                    var DistrictId = ddlDistrict.val();
                                    var VillageId = ddlVillage.val();
                                    var ZipCode = $.trim(txtZipcode.val());
                                    var PbNo = $.trim(txtPbNo.val());
                                    var PostOffice = $.trim(txtPostOffice.val());
                                    var PhoneNo = $.trim(txtPhoneNumber.val());
                                    var AlternatePhoneNo = $.trim(txtAlternatePhoneNo.val());
                                    var EmailId = $.trim(txtEmail.val());
                                    var LocationId = ddlLocationClassification.val();
                                    var UnitOpeningDate = $.emsyne.Utility.convertToDateFormat($.trim(txtUnitOpeningDate.val()), 'dd/mm/yy', 'mm/dd/yy');
                                    if ($.trim(ddlParentUnit.val()) != null) {
                                        ParentUnit = $.trim(ddlParentUnit.val());
                                    }
                                    var Status;
                                    if (queryOrgUnitId != 0) {
                                        AuthorizationStatus = 2;
                                        Status = ddlStatus.val();
                                        if (ddlStatus.val() == 16) {
                                            mergedOrgUnitId = mergedUnitId;
                                            mergedStatusDate = $.emsyne.Utility.convertToDateFormat($.trim(txtStatusDate.val()), 'dd/mm/yy', 'mm/dd/yy');

                                        }
                                        else if (ddlStatus.val() == 17) {
                                            mergedStatusDate = $.emsyne.Utility.convertToDateFormat($.trim(txtStatusDate.val()), 'dd/mm/yy', 'mm/dd/yy');

                                        }
                                        else {
                                            ;
                                            mergedOrgUnitId = 0;
                                            mergedStatusDate = "";

                                        }
                                    }
                                    else {
                                        AuthorizationStatus = 1
                                        mergedOrgUnitId = 0;
                                        mergedStatusDate = "";
                                        Status = 1;
                                    }
                                    if (ddlOrgLevel.val() == $.emsyne.Utility.getGlobalValueByParamId(3)) {
                                        BranchTypeId = ddlBranchType.val();
                                    }
                                    else {
                                        BranchTypeId = 0;
                                    }
                                    var UnitInCharge = $.trim(txtUnitInCharge.val());
                                    //var Status = ddlStatus.val();
                                    var StatusDate = $.trim(txtStatusDate.val());
                                    var Unit = $.trim(txtUnit.val());
                                    var UnitCode = $.trim(txtUnitCode.val());
                                    $.OrgUnitCreation.fnSave(OrgLevelId, BranchTypeId, BranchName, BranchCode, BranchLandMark, Street, NameOfBuilding, CountryId, IslandName, DistrictId, VillageId,
                                        ZipCode, PbNo, PostOffice, PhoneNo, AlternatePhoneNo, EmailId, LocationId, UnitOpeningDate, ParentUnit, UnitInCharge, Status, StatusDate, Unit, UnitCode, mergedOrgUnitId, mergedStatusDate, AuthorizationStatus);
                                }
                                $(".bootbox-confirm").modal('hide');
                            }
                            else {
                                $(".bootbox-confirm").modal('hide');
                                iClickOnce = 0;
                                iClickSubmit = 0;
                            }
                        }
                    });
                }
                else {
                    $.emsyne.Utility.ShowMessage("Same unit cannot merge", Alert, '#txtUnitName');//ORG05
                    $("#txtUnitName").focus();
                }
            }
            else {
                bootbox.alert({
                    message: gridValidation,
                    title: "Alert",
                    callback: function () {
                        $(".bootbox-alert").modal('hide');
                        return false;
                    }
                });
            }

        }
        btnSave.attr('disabled', false);
    }

}

// end region fnValidate
$.OrgUnitCreation.ValidateMergedUnit = function () {
    var controlToFocus = "";
    var mergeError = false;
    if (queryOrgUnitId != 0) {
        if (txtOrgName.val() == txtUnitName.val()) {
            txtUnitName.addClass(ERROR_CLASS);
            mergeError = true;
            if (controlToFocus == "")
                controlToFocus = "#txtUnitName";
            txtUnitName.val('');
            $("#txtMergedUnitCode").val('');
            if (controlToFocus == "")
                controlToFocus = "#txtMergedUnitCode";


        }
    }
    return mergeError;

}
$.OrgUnitCreation.fnHolidayValidate = function () {
    var hasError = false;
    var controlToFocus = "";
    $.OrgUnitCreation.ClearHasHolidayErrorClass();
    if ($.emsyne.Utility.GetNumericValue(ddlWeekDays.val()) < 0) {
        $("button[data-id=ddlWeekDays]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlWeekDays]";
    }
    if ($.emsyne.Utility.GetNumericValue(ddlNature.val()) < 0) {
        $("button[data-id=ddlNature]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlNature]";
    }
    if (ddlOccurence.val() == null) {
        $("button[data-id=ddlOccurence]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlOccurence]";
    }

    iClickSubmit = 0;
    return hasError;
}
$.OrgUnitCreation.fnScheduleValidate = function () {
    var hasError = false;
    var controlToFocus = "";
    $.OrgUnitCreation.ClearHasScheduleErrorClass();
    if ($.emsyne.Utility.GetNumericValue(ddlWorkingDay.val()) < 0) {
        $("button[data-id=ddlWorkingDay]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlWorkingDay]";
    }// 
    if (($.trim($('#txtFromHour').val()) == "0:00") && ($.trim($('#txtFromHour').val()) == "0:00")) {
        $('#txtFromHour').removeClass("form-group");
        $('#txtFromHour').addClass("invalid");
        hasError = true;
    } else {
        var start_time = $("#txtFromHour").val();
        var end_time = $("#txtToHour").val();

        //convert both time into timestamp
        var stt = new Date("November 13, 2013 " + start_time);
        stt = stt.getTime();

        var endt = new Date("November 13, 2013 " + end_time);
        endt = endt.getTime();

        if (stt >= endt) {
            $('#txtToHour').addClass("invalid");
            hasError = true;
            compareTime = 1;
        }
    }
    if ($.trim($('#txtToHour').val()) == "0:00") {
        $('#txtToHour').removeClass("form-group");
        $('#txtToHour').addClass("invalid");
        hasError = true;
    }
    if (ddlOccurenceSchedule.val() == null) {
        $("button[data-id=ddlOccurenceSchedule]").addClass(ERROR_CLASS);
        hasError = true;
        if (controlToFocus == "")
            controlToFocus = "button[data-id=ddlOccurenceSchedule]";
    }

    iClickSubmit = 0;
    return hasError;
}

$.OrgUnitCreation.fnValidateGridRecord = function () {
    var hasError = false;
    // var tableOrgHliday = $('#grdOrgHoliday').DataTable();
    // var dataOrgHliday = tableOrgHliday.rows().data();
    var tableOrgSchedule = $('#grdOrgUnitWorkingSchedule').DataTable();
    var dataOrgSchedule = tableOrgSchedule.rows().data();
    //if (dataOrgHliday.length == 0) {
    //    if (!$("#collapseTwo").hasClass("in")) {
    //        $("#headingTwo").click();
    //    }
    //    gridValidation = "Please enter weekly holiday details";
    //    hasError = true;
    //}
    //else 
    if (dataOrgSchedule.length == 0) {
        if (!$("#collapseThree").hasClass("in")) {
            $("#headingThree").click();
        }
        gridValidation = cm146;
        hasError = true;
    }
    return hasError;
}

$.OrgUnitCreation.fnAddHolidayGrid = function () {
    if (!$.OrgUnitCreation.fnHolidayValidate()) {
        if (!$.OrgUnitCreation.fnHolidayDuplicationValidate()) {
            tableOrgunitHoliday = ObjOrgUnitHoliday;

            var weekdays = $('#ddlWeekDays option:selected').text();
            var nature = $('#ddlNature option:selected').text();
            var arrrowName = $('#ddlOccurence option:selected').toArray().map(item => item.text).join();
            var occurenceArray = new Array();
            occurenceArray = arrrowName.split(",");


            for (var occurenceId = 0; occurenceId < occurenceArray.length; occurenceId++) {
                tableOrgunitHoliday.row.add([
                    hdnId,
                    weekdays,
                    nature,
                    occurenceArray[occurenceId],
                ]).draw(false);
            }
            $.OrgUnitCreation.fnHolidayClearControls();
            $.OrgUnitCreation.ClearHasHolidayErrorClass();

        }
        else {
            $.emsyne.Utility.ShowMessage("Could not be saved because of duplicate data", "Duplicate", '#ddlWeekDays');

            //bootbox.confirm({
            //    message: "Could not be saved because of duplicate data",
            //    title: "Confirm",
            //    callback: function (result) {
            //        if (result == true) {

            //            iClickOnce = 0;
            //            iClickSubmit = 0;
            //            $(".bootbox-alert").modal('hide');

            //        }
            //        else {
            //            $(".bootbox-confirm").modal('hide');
            //            iClickSumbit = 0;
            //        }
            //    }
            //});
        }
    }
    else {
        bootbox.alert({
            message: cm054,
            title: "Alert",
            callback: function () {
                $(".bootbox-alert").modal('hide');
                return false;
            }
        });
    }
}
$.OrgUnitCreation.fnHolidayClearControls = function () {
    ddlWeekDays.val('0');
    ddlWeekDays.selectpicker('refresh');

    ddlNature.val('0');
    ddlNature.selectpicker('refresh');

    ddlOccurence.val('0');
    ddlOccurence.selectpicker('refresh');
}
$.OrgUnitCreation.fnAddHoliday = function () {

    $.OrgUnitCreation.ClearHasHolidayErrorClass();

    var table = $('#grdOrgHoliday').DataTable();
    var HolidayWeekdaysID = new Array();
    var HolidayNature = new Array();
    var HolidayOccurence = new Array();
    var HolidayStatus = new Array();
    var data = table.rows().data();
    var dayType;
    var natureTypeId;
    var occurenceTypeId;
    for (var i = 0; i < data.length; i++) {
        //if (data[i][0] == 0) {
        dayType = $.OrgUnitCreation.fnAddDayType(data[i][1]);
        natureTypeId = $.OrgUnitCreation.fnAddNatureType(data[i][2]);
        occurenceTypeId = $.OrgUnitCreation.fnAddOccurenceType(data[i][3]);

        HolidayWeekdaysID.push(parseInt(dayType));
        HolidayNature.push(parseInt(natureTypeId));
        HolidayOccurence.push(parseInt(occurenceTypeId));
        HolidayStatus.push(1);
        // }
    }
    //if (0 < data.length) {
        ObjMultiHolidayDetails.WEEKLY_HOLIDAY = HolidayWeekdaysID;
        ObjMultiHolidayDetails.HOLIDAY_NATURE = HolidayNature;
        ObjMultiHolidayDetails.OCCURRENCE = HolidayOccurence;
        ObjMultiHolidayDetails.STATUS = HolidayStatus;
    //}
}

$.OrgUnitCreation.fnAddDayType = function (dayType_) {
    var DayType = 0;
    switch (dayType_) {
        case "Sunday":
            DayType = 1;
            break;
        case "Monday":
            DayType = 2;
            break;
        case "Tuesday":
            DayType = 3;
            break;
        case "Wednesday":
            DayType = 4;
            break;
        case "Thursday":
            DayType = 5;
            break;
        case "Friday":
            DayType = 6;
            break;
        case "Saturday":
            DayType = 7;
            break;
    }
    return DayType;

}
$.OrgUnitCreation.fnAddNatureType = function (NatureType_) {
    var natureId;
    switch (NatureType_) {
        case "Full Day":
            natureId = 1;
            break;
        case "Fore Noon":
            natureId = 2;
            break;
        case "After Noon":
            natureId = 3;
            break;
    }
    return natureId;

}
$.OrgUnitCreation.fnAddOccurenceType = function (OccurenceType_) {
    var OccurenceTypeId;
    switch (OccurenceType_) {
        case "All":
            OccurenceTypeId = 0;
            break;
        case "1ST":
            OccurenceTypeId = 1;
            break;
        case "2nd":
            OccurenceTypeId = 2;
            break;
        case "3rd":
            OccurenceTypeId = 3;
            break;
        case "4th":
            OccurenceTypeId = 4;
            break;
        case "5th":
            OccurenceTypeId = 5;
            break;
    }
    return OccurenceTypeId;
}

$.OrgUnitCreation.fnAddScheduleGrid = function () {
    if (!$.OrgUnitCreation.fnScheduleValidate()) {
        if (!$.OrgUnitCreation.fnScheduleDuplicationValidate()) {
            tableOrgUnitSchedule = ObjOrgUnitSchedule;
            var scheduleWeekdays = $('#ddlWorkingDay option:selected').text();
            var workingHour = txtFromHour.val() + ' - ' + txtToHour.val();
            var scheduleArrrowName = $('#ddlOccurenceSchedule option:selected').toArray().map(item => item.text).join();
            var scheduleOccurenceArray = new Array();
            scheduleOccurenceArray = scheduleArrrowName.split(",");
            for (var scheduleOccurenceId = 0; scheduleOccurenceId < scheduleOccurenceArray.length; scheduleOccurenceId++) {

                tableOrgUnitSchedule.row.add([
                    hdnId,
                    scheduleWeekdays,
                    workingHour,
                    scheduleOccurenceArray[scheduleOccurenceId],
                ]).draw(false);
            }
            $.OrgUnitCreation.fnScheduleClearControls();
            $.OrgUnitCreation.ClearHasScheduleErrorClass();
        }
        else {
            $.emsyne.Utility.ShowMessage("Could not be saved because of duplicate data", "Duplicate", '#ddlWorkingDay');
            //bootbox.confirm({
            //    message: "Could not be saved because of duplicate data",
            //    title: "Confirm",
            //    callback: function (result) {
            //        if (result == true) {
            //            iClickOnce = 0;
            //            iClickSubmit = 0;
            //            $(".bootbox-alert").modal('hide');

            //        }
            //        else {
            //            $(".bootbox-confirm").modal('hide');
            //            iClickSumbit = 0;
            //        }
            //    }
            //});
        }
    }
    else if (compareTime == 0) {
        bootbox.alert({
            message: cm054,
            title: "Alert",
            callback: function () {
                $(".bootbox-alert").modal('hide');
                return false;
            }
        });

    }
    else if (compareTime == 1) {
        bootbox.alert({
            message: "From time need to be less than To time",
            title: "Alert",
            callback: function () {
                $(".bootbox-alert").modal('hide');
                $('#txtFromHour').focus();
                return false;
            }
        });
    }

}
$.OrgUnitCreation.fnScheduleClearControls = function () {
    ddlWorkingDay.val('0');
    ddlWorkingDay.selectpicker('refresh');

    txtFromHour.val('0:00');
    txtToHour.val('0:00');
    ddlOccurenceSchedule.val('0');
    ddlOccurenceSchedule.selectpicker('refresh');

    var times = "00:00:00";
    $('#txtFromHour').timepicker('setTime', times);
    $('#txtToHour').timepicker('setTime', times);
}

$.OrgUnitCreation.fnScheduleDuplicationValidate = function () {
    var error = false;
    var scheduleArrrowName = $('#ddlOccurenceSchedule option:selected').toArray().map(item => item.text).join();
    var scheduleOccurenceArray = new Array();
    scheduleOccurenceArray = scheduleArrrowName.split(",");
    var table = $('#grdOrgUnitWorkingSchedule').DataTable();
    var data = table.rows().data();
    for (var i = 0; i < data.length; i++) {

        //if (data[i][2] == txtFromHour.val() + ' - ' + txtToHour.val()) {


        if (data[i][1] == $('#ddlWorkingDay option:selected').text()) {


            for (var scheduleOccurenceId = 0; scheduleOccurenceId < scheduleOccurenceArray.length; scheduleOccurenceId++) {

                if (data[i][3] == scheduleOccurenceArray[scheduleOccurenceId]) {

                    error = true;
                }
                else if (data[i][3] == "All") {
                    error = true;
                }

            }
        }
        // }
    }
    return error;
}

$.OrgUnitCreation.fnHolidayDuplicationValidate = function () {
    var error = false;
    var arrrowName = $('#ddlOccurence option:selected').toArray().map(item => item.text).join();
    var occurenceArray = new Array();
    occurenceArray = arrrowName.split(",");
    var table = $('#grdOrgHoliday').DataTable();
    var data = table.rows().data();
    for (var i = 0; i < data.length; i++) {

        if (data[i][2] == $('#ddlNature option:selected').text()) {


            if (data[i][1] == $('#ddlWeekDays option:selected').text()) {


                for (var holidayOccurenceId = 0; holidayOccurenceId < occurenceArray.length; holidayOccurenceId++) {

                    if (data[i][3] == occurenceArray[holidayOccurenceId]) {

                        error = true;
                    }
                    else if (data[i][3] == "All") {
                        error = true;
                    }

                }
            }
        }
    }
    return error;
}

$.OrgUnitCreation.fnAddSchedule = function () {
    // $.OrgUnitCreation.ClearHasHolidayErrorClass();

    var ScheduleWeekdaysID = new Array();
    var FromHour = new Array();
    var ToHour = new Array();
    var ScheduleOccurence = new Array();
    var STATUS = new Array();

    var table = $('#grdOrgUnitWorkingSchedule').DataTable();
    var data = table.rows().data();
    var dayType;
    var occurenceTypeId;
    var _timeArray = new Array();
    var _Time;


    for (var i = 0; i < data.length; i++) {
        //if (data[i][0] == 0) {
        _Time = data[i][2];
        _timeArray = _Time.split("-");
        dayType = $.OrgUnitCreation.fnAddDayType(data[i][1]);
        occurenceTypeId = $.OrgUnitCreation.fnAddOccurenceType(data[i][3]);
        ScheduleWeekdaysID.push(dayType);
        FromHour.push((_timeArray[0]).trim());
        ToHour.push((_timeArray[1]).trim());
        ScheduleOccurence.push(occurenceTypeId);
        STATUS.push(1);
        // }
    }
    ObjMultischeduleDetails.DAY_ID = ScheduleWeekdaysID;
    ObjMultischeduleDetails.TIME_FROM = FromHour;
    ObjMultischeduleDetails.TIME_TO = ToHour;
    ObjMultischeduleDetails.OCCURRENCE = ScheduleOccurence;
    ObjMultischeduleDetails.STATUS = STATUS;

}

$.OrgUnitCreation.fnLoadUnitData = function (queryOrgUnitId) {
    var tOrgUnitMaster = new OrgUnitCreationMaster();
    tReturnOrgDetails = tOrgUnitMaster.GetOrgUnitDetails(queryOrgUnitId);
    //btnSave.hide();
    btnApprove.show();
    //btnUpdate.show();
    $('#divStatus').show();
    $('#divUnitInCharge').show();
    $.OrgUnitCreation.fnFillDetails(tReturnOrgDetails);

}
$.OrgUnitCreation.ZipCodeValidate = function () {
    var Ziperror = true;
    for (var i = 0; i < pinCodeCountry.length; i++) {
        if (pinCodeCountry[i] == txtZipcode.val()) {
            Ziperror = false;
        }
    }
    return Ziperror;
}
$.OrgUnitCreation.FillPostalDetails = function () {

    $('#ddlIsland,#ddlDistrict,#ddlVillage').selectpicker("refresh");
    var CountryId = $.trim(ddlCountry.val());
    $('#txtZipcode').val("");
    $('#txtPostOffice').val("");

    if (parseFloat(CountryId) > 0) {
        var selCountryRow = $.grep(countryResult, function (e, i) { return e.COUNTRY_ID == CountryId; });
        if (selCountryRow != null && selCountryRow.length > 0) {
            if (selCountryRow[0].IS_POSTAL_DETAILS_AVAILABLE == 1) {
                hasPinCode = true;
                var status = 1;
                var tOrgUnitCreationMaster = new OrgUnitCreationMaster();

                var postalDetailsByCountryId = tOrgUnitCreationMaster.GetZipByCountryId(parseInt(CountryId), status);
                isAutoComplete = 1;
                var rsCountryPostcodes = postalDetailsByCountryId.ResultSet;

                var ziparray = $.map(rsCountryPostcodes, function (e, i) {
                    return {
                        value: e.POSTAL_CODE,
                        postalId: e.POSTAL_ID,
                        postoffice: e.POST_OFFICE,
                        state: e.STATE_ID,
                        district: e.DISTRICT_ID,
                        village: e.VILLAGE_ID,
                        villagename: e.VILLAGE_NAME,
                        statename: e.STATE_NAME,
                        districtname: e.DISTRICT_NAME
                    };
                });
                pinCodeCountry = ziparray;
                $('#txtZipcode').autocomplete({
                    lookup: ziparray,
                    minLength: 1,
                    appendTo: '#divZip',
                    onSelect: function (e) {
                        hdnPinCode = e.value;
                        $('#hdnPostalId').val(e.postalId);
                        $('#txtPostOffice').val(e.postoffice);

                        $.OrgUnitCreation.fnBindIsland();
                        var hasIsland = $('#ddlIsland option[value="' + e.state + '"]');
                        if (hasIsland.length != 0) {
                            $("#ddlIsland").val(e.state);
                        }
                        $.OrgUnitCreation.fnBindDistrict();
                        var hasDistrict = $('#ddlDistrict option[value="' + e.district + '"]');
                        if (hasDistrict.length != 0) {
                            $("#ddlDistrict").val(e.district);
                        }

                        $.OrgUnitCreation.fnBindVillage();
                        var hasVillage = $('#ddlVillage option[value="' + e.village + '"]');
                        if (hasVillage.length != 0) {
                            $("#ddlVillage").val(e.village);
                        }
                        $('#ddlIsland,#ddlDistrict,#ddlVillage').selectpicker("refresh");

                        return false;
                    }
                });


            }
            else {
                //$('#txtZipcode').autocomplete({
                //    lookup: ziparray,
                //    minLength: 1,
                //    appendTo: '#divZip'
                //});


                hasPinCode = false;
                postalId = 0;
                $("#txtZipcode").autocomplete({
                    source: "",
                    delay: 200,
                    minLength: 1,
                    select: function (event, ui) {
                        $("#txtPinCode").val() = "";
                        return false;
                    }
                });

            }
        }
    }
    //  if ($('#txtZipcode').val()=="")
    $.OrgUnitCreation.fnBindIsland();
    $.OrgUnitCreation.fnBindDistrict();
    $.OrgUnitCreation.fnBindVillage();
    $('#ddlIsland,#ddlDistrict,#ddlVillage').selectpicker("refresh");
}
$.OrgUnitCreation.DateCompare = function () {
    var dateBeforeOneMonth = sysDate;
    var dateArray = new Array();
    dateArray = dateBeforeOneMonth.split("/");
    if (dateArray[1] == 1) {
        dateArray[1] = 12;
        dateArray[2] = dateArray[2] - 1;
    }
    else {
        dateArray[1] = dateArray[1] - 1;
    }
    BeforeDate = dateArray[0] + "/" + dateArray[1] + "/" + dateArray[2];

}
$.OrgUnitCreation.AfterOneMonth = function () {
    var dateBeforeOneMonth_ = sysDate;
    var dateArray_ = new Array();
    dateArray_ = dateBeforeOneMonth_.split("/");
    if (dateArray_[1] == 12) {
        dateArray_[1] = 1;
        dateArray_[2] = parseInt(dateArray_[2]) + 1;
    }
    else {
        dateArray_[1] = parseInt(dateArray_[1]) + 1;
    }
    AfterDate = dateArray_[0] + "/" + dateArray_[1] + "/" + dateArray_[2];

}
var eventListenerOrgUnit = function (e) {
    var tOnce = e.currentTarget.attributes.clickOnce;
    var eventType = e.type;
    if (tOnce !== null && tOnce !== undefined && tOnce.value === "true" && (eventType === "click" || eventType === "change"))
        e.currentTarget.removeEventListener(eventType, eventListenerOrgUnit);

    switch (e.currentTarget.attributes.id.nodeValue) {
        case ddlCountry.attr("id"):
            if (eventType == "change") {
                $.OrgUnitCreation.FillPostalDetails();
            }
            break;
        case btnSave.attr("id"):
            $.OrgUnitCreation.fnSubmit();
            break;
        case btnApprove.attr("id"):
            // $.OrgUnitCreation.fnSubmit();
            break;
        //case btnUpdate.attr("id"):
        //     $.OrgUnitCreation.fnSubmit();
        //    break;
        case ddlCountry.attr("id"):
            if (eventType === "change") {

                $.OrgUnitCreation.fnBindIsland();
                $.OrgUnitCreation.fnBindDistrict();
                $.OrgUnitCreation.fnBindVillage();
            }
            break;
        case ddlIsland.attr("id"):
            if (eventType == "change") {

                $.OrgUnitCreation.fnBindDistrict();
                $.OrgUnitCreation.fnBindVillage();
            }
            break;
        case ddlDistrict.attr("id"):
            if (eventType == "change") {

                $.OrgUnitCreation.fnBindVillage();
            }
            break;
        case ddlOrgLevel.attr("id"):
            if (eventType == "change") {
                if (ddlOrgLevel.val() == $.emsyne.Utility.getGlobalValueByParamId(3)) {
                    $("#divBranchType").show();
                }
                else {
                    $("#divBranchType").hide();
                }
                $.OrgUnitCreation.BindParentUnit('#ddlParentUnit', ddlOrgLevel.val());
            }
            break;
        case ddlStatus.attr("id"):
            if (eventType == "change") {
                $('#txtStatusDate').val('');
                if (ddlStatus.val() == 16) {
                    $('#divOrgUnitName').show();
                    $('#divStatusDate').show();
                    $('#divMergedUnitCode').show();
                    if (orgStatus == 16) {
                        txtUnitName.val('');
                        $("#txtMergedUnitCode").val('');
                    }
                }
                else if (ddlStatus.val() == 17) {
                    $('#divStatusDate').show();
                    $('#divOrgUnitName').hide();
                    $('#divMergedUnitCode').hide();

                }
                else if (ddlStatus.val() == 2) {
                    //if (orgStatus == 16 || orgStatus == 17) {

                    //}
                    $('#divOrgUnitName').hide();
                    $('#divStatusDate').hide();
                    $('#divStatusDate').hide();
                    $('#divMergedUnitCode').hide();
                }
                else if (ddlStatus.val() == 1) {
                    //if (orgStatus == 16 || orgStatus == 17) {

                    //}
                    $('#divOrgUnitName').hide();
                    $('#divStatusDate').hide();
                    $('#divStatusDate').hide();
                    $('#divMergedUnitCode').hide();
                }

            }
            break;
        case btnAddHoliday.attr("id"):

            $.OrgUnitCreation.fnAddHolidayGrid();
            // $.OrgUnitCreation.fnAddHoliday();
            break;
        case btnAddSchedule.attr("id"):
            $.OrgUnitCreation.fnAddScheduleGrid();
            break;
        case btnClear.attr("id"):
            if (queryOrgUnitId != 0) {
                $.OrgUnitCreation.fnFillDetails(tReturnOrgDetails);
            }
            else {
                $.OrgUnitCreation.fnClearControls();
                $.OrgUnitCreation.FillPostalDetails();
            }
            $("button[data-id=ddlOrgLevel]").focus();           
            break;
        case btnClose.attr("id"):
            $.emsyne.Utility.loadContentDiv("/Views/ADMS/Settings/frmOrgUnitListing.html");
            $(location).attr("hash", $.rc4EncryptStr("#OrgUnit_ID=0&MODE=0", "20"));
            break;
        case txtEmail.attr("id"):
            if (eventType === "change") {
                $.OrgUnitCreation.fnValidateEmail($.trim(txtEmail.val()), '#txtEmail');
            }
            break;
        case txtOrgName.attr("id"):
            if (eventType === "change") {
                $.OrgUnitCreation.fnValidateUnitName($.trim(txtOrgName.val()), '#txtOrgName');
            }
            break;
        case txtOrgCode.attr("id"):
            if (eventType === "change") {
                $.OrgUnitCreation.fnValidateUnitCode($.trim(txtOrgCode.val()), '#txtOrgCode');
            }
            break;
        case ddlOccurence.attr("id"):
            if (eventType === "change") {
                var str = "";
                $("#ddlOccurence option:selected").each(function () {
                    str = $(this).val();
                    if (str == 0) {
                        $("#ddlOccurence option:selected").removeAttr("selected");
                        $("#ddlOccurence").val(0);
                        return false;
                    }
                });
                $('#ddlOccurence').selectpicker('refresh');
            }
            break;
        case ddlOccurenceSchedule.attr("id"):
            if (eventType === "change") {
                //var all = $(this).find('option:eq(0)');
                //var thisVal = all.html();
                //if (all.is(':selected')) {
                //    $('#ddlOccurenceSchedule').selectpicker('deselectAll');
                //    //$('#ddlOccurenceSchedule').find('option:gt(0)').removeClass('selected');
                //   // $('#ddlOccurenceSchedule').find('option:eq(0)').addClass('selected');
                //    $(this).parents('.bootstrap-select').find('.searchboxwidth').find('ul.dropdown-menu > li:eq(0)').addClass('selected');
                //    // $(this).find('ul.dropdown-menu > li[rel=0]').addClass('selectsed');
                //   // console.log($(this).parents('.bootstrap-select').find('button[data-id=ddlOccurenceSchedule]').find('span.filter-option').html());
                    
                //    //$(this).parents('.bootstrap-select').find('button[data-id=ddlOccurenceSchedule]').find('span.filter-option').html(thisVal);
                //} else {
                //    $(this).parents('.bootstrap-select').find('.searchboxwidth').find('ul.dropdown-menu > li:eq(0)').removeClass('selected');
                //}

                ////var all = $(this).val();; 
                ////var thisVal = all.html();
                ////if (all.is(':selected')) {
                ////    $('.selectpicker').selectpicker('deselectAll');
                ////    $('ul.dropdown-menu > li[rel=0]').addClass('selected');
                ////    $('span.filter-option').html(thisVal);
                ////} else {
                ////    $('ul.dropdown-menu > li[rel=0]').removeClass('selected');
                ////}


                ////var str = "";
                ////$("#ddlOccurenceSchedule option:selected").each(function () {
                ////    str = $(this).val();
                ////    if (str == 0) {
                ////        $('.selectpicker').selectpicker('deselectAll');
                ////        $('ul.dropdown-menu > li[rel=0]').addClass('selected');
                ////      //  $('span.filter-option').html(0);
                ////        //  $("#ddlOccurenceSchedule option:selected").removeAttr("selected");
                ////      //  $("#ddlOccurenceSchedule").val(0);
                ////        return false;
                ////    }
                ////    else {
                ////        $('ul.dropdown-menu > li[rel=0]').removeClass('selected');
                ////        $('#ddlOccurenceSchedule').selectpicker('refresh');
                ////        $('ul.dropdown-menu > li[rel=0]').removeClass('selected');
                ////    }
                ////});

                ////$('#ddlOccurenceSchedule').selectpicker('refresh');


                ///*var arrSelectedValues = [];
                //arrSelectedValues = ddlOccurenceSchedule.val();

                //if ($.inArray("0", arrSelectedValues) !='-1') {
                //    ddlOccurenceSchedule.val([0]);
                //}
                //else {
                //    ddlOccurenceSchedule.val([1, 2, 3, 4, 5]);
                //}*/

                ////var all = $('#ddlOccurenceSchedule option[value=0]');
                ////var thisVal = all.html();
                ////if (all.is(':selected')) {
                ////    $("#ddlOccurenceSchedule").val([0]);
                ////} else {
                ////    $("#ddlOccurenceSchedule").val([1, 2, 3, 4, 5]);
                ////}

                var str = "";
                $("#ddlOccurenceSchedule option:selected").each(function () {
                    str = $(this).val();
                    if (str == 0) {
                        $("#ddlOccurenceSchedule option:selected").removeAttr("selected");
                        $("#ddlOccurenceSchedule").val(0);
                        return false;
                    }
                });
                $('#ddlOccurenceSchedule').selectpicker('refresh');
            }
            break;
        case txtAlternatePhoneNo.attr("id"):
            if (eventType === "change") {
                if (txtPhoneNumber.val() == txtAlternatePhoneNo.val()) {
                    $.emsyne.Utility.ShowMessage(cm147, Alert, "#txtPhoneNumber");
                    txtAlternatePhoneNo.val('');
                }
            }
            break;
        case $('#txtZipcode').attr("id"):
            if (eventType === "change") {
                if (!$.OrgUnitCreation.ZipCodeValidate()) {
                    $.emsyne.Utility.ShowMessage("Enter Valid PinCode", Alert, "#txtZipcode");
                }
            }
            break;
        default:
            console.error("Invalid Event Target!!");
            break;
    }
};


$.OrgUnitCreation.fnAddHolidayGridInit = function () {
    grdOrgHoliday.on('length.dt', function (e, settings, len) {
        tbusrpIndex = 1;
        grdOrgHoliday.DataTable().ajax.reload(null, true);
    });

    grdOrgHoliday.on('page.dt', function () {
        var info = ObjOrgUnitHoliday.page.info();
        tbusrpIndex = parseInt(info.page) + 1;
    });

    grdOrgHoliday.on('draw.dt', function () {
        tbusrpIndex = 1;
    });

    $('#grdOrgHoliday tbody').on('click', 'tr', function () {
        $.emsyne.Utility.rowSelect($(this), ObjOrgUnitHoliday, "Multi");
    });
}
$.OrgUnitCreation.fnAddScheduleGridInit = function () {
    grdOrgUnitWorkingSchedule.on('length.dt', function (e, settings, len) {
        tbusrpIndex = 1;
        grdOrgUnitWorkingSchedule.DataTable().ajax.reload(null, true);
    });

    grdOrgUnitWorkingSchedule.on('page.dt', function () {
        var info = ObjOrgUnitSchedule.page.info();
        tbusrpIndex = parseInt(info.page) + 1;
    });

    grdOrgUnitWorkingSchedule.on('draw.dt', function () {
        tbusrpIndex = 1;
    });

    $('#grdOrgUnitWorkingSchedule tbody').on('click', 'tr', function () {
        $.emsyne.Utility.rowSelect($(this), ObjOrgUnitSchedule, "Multi");
    });
}
var OrgUnitCreationViewInit = function () {



    var PageTitle = 'emBank';
    $(document).prop('title', PageTitle + ' | Unit Details');
    $("#divBranchType").hide();
    $("#btnUpdate").hide();
    $('#divMergedUnitCode').hide();
    $('#divOrgUnitName').hide();
    $('#divStatusDate').hide();
    $('#divUnitInCharge').hide();
    var objQueryString = $.emsyne.Utility.getQueryStringValues(true);
    sysDate = $.emsyne.Utility.GetCurrentDate();

    if (objQueryString != undefined && objQueryString != null) {
        if (objQueryString.MODE != null) {
            queryStrMode = objQueryString.MODE;
        }
        if (objQueryString.OrgUnit_ID != null && objQueryString.OrgUnit_ID != 0) {
            queryOrgUnitId = objQueryString.OrgUnit_ID;

        } else {
            $("#btnSave").show();
            $("#btnApprove").hide();
            $("#btnUpdate").hide();
            $('#divStatusDate').hide();
            $('#divStatus').hide();

        }
    }
    ddlOrgLevel.on("change", eventListenerOrgUnit);
    ddlCountry.on("change", eventListenerOrgUnit);
    ddlIsland.on("change", eventListenerOrgUnit);
    ddlDistrict.on("change", eventListenerOrgUnit);
    ddlStatus.on("change", eventListenerOrgUnit);
    btnSave.on("click", eventListenerOrgUnit);
    btnClose.on("click", eventListenerOrgUnit);
    btnApprove.on("click", eventListenerOrgUnit);
    //btnUpdate.on("click", eventListenerOrgUnit);
    btnAddHoliday.on("click", eventListenerOrgUnit);
    btnAddSchedule.on("click", eventListenerOrgUnit);
    ddlCountry.on("change", eventListenerOrgUnit);
    txtEmail.on("change", eventListenerOrgUnit);
    txtOrgName.on("change", eventListenerOrgUnit);
    txtOrgCode.on("change", eventListenerOrgUnit);
    txtZipcode.on("focusout", eventListenerOrgUnit);
    btnClear.on("click", eventListenerOrgUnit);
    ddlOccurence.on("change", eventListenerOrgUnit);
    txtAlternatePhoneNo.on("change", eventListenerOrgUnit);
    ddlOccurenceSchedule.on("change", eventListenerOrgUnit);
    $.OrgUnitCreation.BindOrgLevel('#ddlOrgLevel', -1);
    $.OrgUnitCreation.BindBranchType();
    $.OrgUnitCreation.BindNature("#ddlNature");
    $.OrgUnitCreation.BindWeekDay("#ddlWeekDays");
    $.OrgUnitCreation.BindWeekDay("#ddlWorkingDay");
    $.OrgUnitCreation.BindOccurence("#ddlOccurence");
    $.OrgUnitCreation.BindOccurence("#ddlOccurenceSchedule");
    //$.OrgUnitCreation.BindOccurenceSchedule();
    $.OrgUnitCreation.BindCountryDropdown('#ddlCountry', 1);
    $.OrgUnitCreation.FillPostalDetails();
    $.OrgUnitCreation.BindLocationClassificationDropdown(1);
    $.OrgUnitCreation.BindStatus();
    // $.Units.UnitAutoFillSearchPlugin.GetOrgUnitsPlugin();
    $.emsyne.Utility.initializeDatePickerWithExtendedParams("#txtUnitOpeningDate", false, '-1M', '+1M', "-1:+1");
    $.emsyne.Utility.initializeDatePickerWithExtendedParams("#txtStatusDate", false, '-1M', '+1M', "-1:+1");
    $.OrgUnitCreation.DateCompare();
    $.OrgUnitCreation.AfterOneMonth();

    txtUnitOpeningDate.change(function (e) {

        //$.emsyne.Utility.isDateGreaterThanOrEqual()

        if ($.emsyne.Utility.isDateValid(txtUnitOpeningDate.val(), true, IC01, '#txtUnitOpeningDate')) {
            $.emsyne.Utility.isDateBetween(txtUnitOpeningDate.val(), BeforeDate, AfterDate, true, "Invalid opening date! The date must be within " + BeforeDate + " and " + AfterDate, '#txtUnitOpeningDate');
        }
    });
    txtStatusDate.change(function (e) {
        if ($.emsyne.Utility.isDateValid(txtStatusDate.val(), true, IC01, '#txtStatusDate')) {
            $.emsyne.Utility.isDateBetween(txtStatusDate.val(), BeforeDate, AfterDate, true, "Invalid opening date! The date must be within " + BeforeDate + " and " + AfterDate, '#txtStatusDate');
        }
    });

    $("#headingTwo").click(function (e) {
        setTimeout(function () {
            ObjOrgUnitHoliday.columns.adjust().responsive.recalc();
            $("button[data-id=ddlWeekDays]").focus();
        }, 100);

    });

    $("#headingThree").click(function (e) {
        setTimeout(function () {
            ObjOrgUnitSchedule.columns.adjust().responsive.recalc();
            $("button[data-id=ddlWorkingDay]").focus();
        }, 100);
    });

    $.OrgUnitCreation.dataBindToOrgUnitHolidayGrid();
    $.OrgUnitCreation.dataBindToOrgUnitWorkingSchedule();
    $.OrgUnitCreation.fnAddHolidayGridInit();
    $.OrgUnitCreation.fnAddScheduleGridInit();
    $('#txtToHour').timepicker({
        showMeridian: false,
        maxHours: 24,
        showSeconds: false,
        defaultTime: times,
        explicitMode: false


    });
    $('#txtFromHour').timepicker({
        showMeridian: false,
        maxHours: 24,
        showSeconds: false,
        defaultTime: times,
        explicitMode: false


    });
    $("#txtZipcode").blur(function (e) {

        if (hdnPinCode == 0 && hasPinCode) {
            postalId = 0;
            $.OrgUnitCreation.fnBindIsland();
            $.OrgUnitCreation.fnBindDistrict();
            $.OrgUnitCreation.fnBindVillage();
            txtPostOffice.val("");
            txtZipcode.val("");
            txtPbNo.val("");
        }

    });

    $("#txtZipcode").keydown(function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode != 9 && hasPinCode) {
            postalId = 0;
            $.OrgUnitCreation.fnBindIsland();
            $.OrgUnitCreation.fnBindDistrict();
            $.OrgUnitCreation.fnBindVillage();
            txtPostOffice.val("");
            //txtZipcode.val("");
            txtPbNo.val("");
            hdnPinCode = 0;

        }
        else {
            if ($("#txtPostOffice").val() == "" && hasPinCode) {

                txtZipcode.val("");
            }
        }
    });
    $("#txtZipcode").focusout(function (e) {
        if ($("#txtPostOffice").val() == "" && hasPinCode) {
            txtZipcode.val("");
        }
    });



    _payLoad = $.emsyne.Utility.GetPayload($.emsyne.Utility.getCookie("token"));
    if (_payLoad !== null) {
        UserId = _payLoad["UserId"].split(" ")[0].split("-");
        CompanyId = _payLoad["CompanyId"].split(" ")[0].split("-");
    }

    if (queryOrgUnitId != 0 && queryStrMode != 2) {
        $.OrgUnitCreation.fnLoadUnitData(queryOrgUnitId);
    }
    else if (queryOrgUnitId != 0 && queryStrMode == 2) {
        $.OrgUnitCreation.fnLoadUnitData(queryOrgUnitId);
        $("#OrgMainDiv :input").attr("disabled", true);
        $("#btnClose").attr("disabled", false);
        var tableOrgUnitScheduleDisable = $('#grdOrgUnitWorkingSchedule').DataTable();
        tableOrgUnitScheduleDisable.buttons().disable();
        var tableOrgUnitHolidayDisable = $('#grdOrgHoliday').DataTable();
        tableOrgUnitHolidayDisable.buttons().disable();
    }
    txtPhoneNumber.numeric();
    txtAlternatePhoneNo.numeric();
    txtZipcode.numeric();
    //$.Units.UnitAutoFillSearchPlugin.GetOrgUnitsPlugin();
    $.emsyne.Utility.handlePageTabout({ firstControlID: 'button[data-id=ddlOrgLevel]', lastControlID: '#btnClose' });
    setTimeout(function () { $("button[data-id=ddlOrgLevel]").focus(); }, 500);


}();
