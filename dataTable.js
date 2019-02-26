$.TellerScroll.TellerTrans = function () {
    var ObjTellerSearch = new Object();
    var tTellerScroll = new TellerScrollMaster();

    searchedUnitID = unitId;
    searchedUnitToDisplay = $.trim($("#txtBranchName").val());
    searchedTellerUserId = ddlTellerName.val();
    searchedTellerToDisplay = $("#ddlTellerName option:selected").text();
    searchedTransDate = $.trim(txtTransactionDate.val());
    searchedCounterId = ddlCounterName.val();
    searchedCounterToDisplay = $("#ddlCounterName option:selected").text();
    searchedTransType = ddlTransactionMode.val();
    searchedTransModeToDisplay = $("#ddlTransactionMode option:selected").text();

    ObjTellerSearch.OrgUnitId = searchedUnitID;
    ObjTellerSearch.TellerUserId = searchedTellerUserId;
    ObjTellerSearch.TransDate = $.emsyne.Utility.convertToDateFormat(searchedTransDate, 'dd/mm/yy', 'mm/dd/yy');
    ObjTellerSearch.CounterId = searchedCounterId;
    ObjTellerSearch.TransType = searchedTransType;
    ObjTellerSearch.Flag = 1;

    //ObjTellerSearch.OrgUnitId = 14;
    //ObjTellerSearch.TellerUserId = 26;
    //ObjTellerSearch.CounterId = 35;
    //ObjTellerSearch.TransType = 0;
    //ObjTellerSearch.Flag = 1;

    var stringifydata = JSON.stringify(ObjTellerSearch);
    var tReturn = tTellerScroll.GetTellerScroll(stringifydata);
    var resultSet = tReturn.ResultSet0.ResultSet;
    var totalResultSet = tReturn.ResultSet1.ResultSet1;
    var adColumns = [];
    var columnIndex = 0;

    if ($.fn.DataTable.isDataTable('#grdTeller')) {
        ObjgrdTeller.destroy();
        ObjgrdTeller = "";
        amountColumns = [];
        $('#grdTeller').empty();
    }

    if (resultSet.length != 0) {
        $("#divGridTeller").show();
        $("#divGrid").hide();

        Object.keys(resultSet[0]).forEach(key => {
            var col = {
                data: key,
                title: key.replace(/Deposit_/g, "").replace(/Withdraw_/g, "").replace(/Balance_/g, "").replace(/TELLER_/g, "").replace(/NARRATION/g, "Transaction Details").replace(/CREATED_ON/g, "Time").replace(/TRANS_NUMBER/g, "Trans.ID")
            };
            if (columnIndex > 4) {
                amountColumns.push(columnIndex);
            }
            columnIndex++;
            adColumns.push(col);
        });

        var footer = '<tfoot><tr role="row" id="tfootr"></tr></tfoot>';
        $(footer).appendTo('#grdTeller');
        $.map(adColumns, function (v, i) {
            var controlID = v.data.replace(/ /g, "");
            $('<th>', {
                id: 'th' + controlID,
                style: 'border:none;background-color:#f6f7f7;'
            }).appendTo('#tfootr');
            if ((v.data.indexOf('Deposit_') > -1) || (v.data.indexOf('Balance_') > -1) || (v.data.indexOf('Withdraw_') > -1)) {
                $('<span />', {
                    id: 'txt' + controlID,
                    class: 'control-label text-right',
                    style: 'width:100%;font-weight:bold; font-size:9pt;'
                }).appendTo('#' + 'th' + controlID);
            }
        });
        var idName;
        for (var i = 0; i < totalResultSet.length; i++) {
            for (var name in totalResultSet[i]) {
                var controlID = name.replace(/ /g, "");
                $("#txt" + controlID).text(totalResultSet[0][name]);
                $("#txt" + controlID).attr('title', totalResultSet[0][name]);
                $("#txt" + controlID).prop('disabled', true);
            }
        }
        var BalanceLength = resultSet.length - 1;
        while (BalanceLength == resultSet.length - 1) {
            checkNull = BalanceLength;
            for (var name in resultSet[BalanceLength]) {
                var controlID = name.replace(/ /g, "");
                var n = name.startsWith("Balance_");
                if (n == true) {
                    if (resultSet[checkNull][name] == null || resultSet[checkNull][name] == "") {
                        for (var i = checkNull; checkNull >= 0; checkNull--) {
                            if (resultSet[checkNull][name] != null && resultSet[checkNull][name] != "") {
                                $("#txt" + controlID).text(resultSet[checkNull][name]);
                                $("#txt" + controlID).attr('title', resultSet[checkNull][name]);
                                $("#txt" + controlID).prop('disabled', true);
                                break;
                            }
                        }
                    }
                    else {
                        $("#txt" + controlID).text(resultSet[checkNull][name]);
                        $("#txt" + controlID).attr('title', resultSet[checkNull][name]);
                        $("#txt" + controlID).prop('disabled', true);
                    }
                }
                checkNull = BalanceLength;
            }
            BalanceLength--
        }
        // $("#txtBalance_AUD").val("Test");

        //$('#grdTeller').DataTable().destroy();

        ObjgrdTeller = $('#grdTeller').DataTable({
            responsive: {
                details: true
            },
            "filter": false,
            "scrollY": 285,
            "scrollX": true,
            responsive: false,
            "orderClasses": false,
            "columnDefs": [
                {
                    targets: [2], render: function (data, type, full, meta) {
                        if (data != null) {
                            var hour = data.Hours;
                            var minutes = data.Minutes;
                            var seconds = data.Seconds;
                            if (data.Hours.toString().length == 1) {
                                hour = "0" + data.Hours.toString();
                            }
                            if (data.Minutes.toString().length == 1) {
                                minutes = "0" + data.Minutes.toString();
                            }
                            if (data.Seconds.toString().length == 1) {
                                seconds = "0" + data.Seconds.toString();
                            }
                            return (hour + ":" + minutes + ":" + seconds);//$.emsyne.Utility.getSerializedDate(data);//$.emsyne.Utility.getSerializedDate(data);
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    targets: [3], render: function (data, type, full, meta) {
                        var RetVal = "";
                        switch (data) {
                            case 1:
                                RetVal = "Receipts";
                                break;
                            case 2:
                                RetVal = "Payment";
                                break;
                        }

                        return RetVal;
                    }
                },
                { visible: false, targets: [1, 3] },
                { targets: [0], render: $.emsyne.Utility.ellipsis(15) },
                { targets: amountColumns, render: $.emsyne.Utility.ellipsis(13) },
                { "className": "text-right", targets: amountColumns }

            ],
            "ordering": false,
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

                    text: '<i class="fa fa-eye"></i><span class="grid_button pView">View</span>',
                    action: function (e, dt, node, config) {
                        selectedRow = $.map(ObjgrdTeller.rows('.selected').data(), function (item) {
                            return item;
                        });
                        if (selectedRow.length > 0) {
                            $.emsyne.Utility.ShowMessage("This functionality is not available currently", "Alert", '');
                            return false;
                        }
                        else {
                            $.emsyne.Utility.ShowMessage(cm081, "Alert", '');
                            return false;
                        }
                    }
                },
                {
                    text: '<i class="fa fa-money"></i><span class="grid_button pView">Currency Wise Transactions Details</span>',
                    action: function (e, dt, button, config) {

                        $('#divDenominationScroll').empty();

                        var ObjTellerSearch = new Object();
                        var tTellerScroll = new TellerScrollMaster();
                        ObjTellerSearch.OrgUnitId = searchedUnitID;
                        ObjTellerSearch.TellerUserId = searchedTellerUserId;
                        ObjTellerSearch.TransDate = $.emsyne.Utility.convertToDateFormat(searchedTransDate, 'dd/mm/yy', 'mm/dd/yy');
                        ObjTellerSearch.CounterId = searchedCounterId;
                        ObjTellerSearch.TransType = searchedTransType;
                        ObjTellerSearch.Flag = 2;

                        var headerHTML = '<div class="col-md-2 col-sm-12 col-xs-12">Date : ' + searchedTransDate + '</div>' +
                            '<div class="col-md-2 col-sm-12 col-xs-12">Branch : ' + searchedUnitToDisplay + '</div>' +
                            '<div class="col-md-2 col-sm-12 col-xs-12">Teller : ' + searchedTellerToDisplay + '</div>' +
                            '<div class="col-md-2 col-sm-12 col-xs-12">Counter : ' + searchedCounterToDisplay + '</div>' +
                            '<div class="col-md-2 col-sm-12 col-xs-12">Mode : ' + searchedTransModeToDisplay + '</div>' +
                            //'<div class="col-md-3 col-sm-12 col-xs-12">Report Generated On : ' + $("#curDateTime").html() + '</div>' +
                            '<div class="clearfix"> </div>';

                        $("#divDenominationScroll").append(headerHTML);

                        var stringifydata = JSON.stringify(ObjTellerSearch);
                        var tReturn = tTellerScroll.GetTellerScroll(stringifydata);
                        var resultSet = tReturn.ResultSet0.ResultSet;
                        var totalResultSet = tReturn.ResultSet1.ResultSet1;

                        headerHTML = '<div class="col-md-12 col-lg-12 col-sm-12 col-xs-12" style="padding-top:3px;">' +
                            '<table id="grdDenominationScroll" class="table table-bordered jambo_table dt-responsive nowrap" cellspacing="0" width="100%">' +
                            '<thead><tr><th><span></span></th>';

                        var tdth = '';

                        if (totalResultSet.length > 0) {
                            for (var i = 0; i < totalResultSet.length; i++) {
                                var currencyDenomination = totalResultSet[i].DENOMINATIONS.split(',');
                                headerHTML = headerHTML + '<th style="text-align:center" colspan="' + currencyDenomination.length + '"><span>' + totalResultSet[i].CURRENCY + '</span></th><th style="text-align:right"><span>Total</span></th>';
                            }

                            headerHTML = headerHTML + '</tr><tr><th><span></span></th>';

                            for (var i = 0; i < totalResultSet.length; i++) {
                                var currencyDenomination = totalResultSet[i].DENOMINATIONS.split(',');
                                for (var j = 0; j < currencyDenomination.length; j++) {
                                    headerHTML = headerHTML + '<th style="text-align:right;"><span>' + (currencyDenomination[j].indexOf(".") >= 0 ? parseFloat(currencyDenomination[j]).toFixed(2) : currencyDenomination[j])  + '</span></th>';
                                }
                                headerHTML = headerHTML + '<th><span></span></th>'
                            }

                            headerHTML = headerHTML + '</tr>';
                        }

                        headerHTML = headerHTML + '</thead><tbody>';

                        if (resultSet.length > 0) {
                            var transType = 0;
                            for (var i = 0; i < resultSet.length; i++) {

                                if (i + 1 == resultSet.length) {
                                    headerHTML = headerHTML + '</tbody>';
                                    headerHTML = headerHTML + '<tfoot>';
                                    tdth = "th";
                                }
                                else
                                    tdth = "td";

                                transType = 0;
                                headerHTML = headerHTML + '<tr FONTCOLOR>';
                                $.each(resultSet[i], function (key, item) {
                                    if (key == "TRANS_TYPE") {
                                        transType = item;
                                    }
                                    if (key != "TELLER_TRANS_ID" && key != "TRANS_NUMBER" && key != "TRANS_TYPE") {
                                        if (key == "NARRATION") {
                                            if (item != null) {
                                                var shortText = item;
                                                if (item.length > 15) {
                                                    shortText = item.substr(0, 12) + "...";
                                                }
                                                headerHTML = headerHTML + '<' + tdth + ' title="' + item + '"> ' + shortText + '</' + tdth + '>';
                                            }
                                            else {
                                                headerHTML = headerHTML + '<' + tdth + ' style="text-align:right"> Total </' + tdth + '>';
                                            }
                                        }
                                        else
                                            headerHTML = headerHTML + '<' + tdth + ' style="text-align:right;">' + (item == null ? "" : item) + '</' + tdth + '>';
                                    }
                                });

                                if (transType == 1)
                                    headerHTML = headerHTML.replace(/FONTCOLOR/g, 'style="color:green"');
                                else if (transType == 2)
                                    headerHTML = headerHTML.replace(/FONTCOLOR/g, 'style="color:red"');
                                else if (transType == null)
                                    headerHTML = headerHTML.replace(/FONTCOLOR/g, 'style="font-weight:bold;"');

                                headerHTML = headerHTML + '</tr>';
                                if (i + 1 == resultSet.length) {
                                    headerHTML = headerHTML + '</tfoot>'
                                }
                            }
                        }

                        headerHTML = headerHTML + '</table></div> <div class="clearfix"> </div>';
                        $("#divDenominationScroll").append(headerHTML);
                        $("#ModalTellerScroll").modal();

                        //if ($.fn.DataTable.isDataTable('#grdDenominationScroll')) {
                        //    ObjgrdDenominationScroll.destroy();
                        //}

                        ObjgrdDenominationScroll = $('#grdDenominationScroll').DataTable({
                            "filter": false,
                            "paging": false,
                            "ordering": false,
                            "scrollY": 285,
                            "scrollX": true,
                            responsive: false,
                            scrollCollapse: true,

                            //"ordering": false,
                            //"filter": false,
                            //"paging": false,
                            "info": true,

                            //"bProcessing": true,
                            //"bServerSide": false,

                            //"dom": '<"top">rt<"bottom"Bpfl><"clear">',
                            "dom": '<top><"bottom"pi>',
                            "oLanguage": {
                                "sLengthMenu": "_MENU_",
                                "sInfoEmpty": "<span tkey='View 0 to 0 of 0 entries'>View 0 to 0 of 0 entries</span>",
                                "sInfo": "<span tkey='View'>View</span> _START_ <span tkey='to'>to</span> _END_ <span tkey='of'>of</span> _TOTAL_",
                                "oPaginate": {
                                    "sPrevious": "<span tkey='Previous'>Previous</span>",
                                    "sNext": "<span tkey='Next'>Next</span>"
                                }
                            }
                        });

                        setTimeout(function () {
                            ObjgrdDenominationScroll.columns.adjust().responsive.recalc();
                        }, 90);

                        setTimeout(function () {
                            ObjgrdDenominationScroll.columns.adjust().responsive.recalc();
                        }, 200);

                        //$('#grdDenominationScroll').on('draw.dt', function () {
                        //    tbusrpIndex = 1;
                        //});
                        //$('#grdDenominationScroll').on('page.dt', function () {
                        //    var info = ObjgrdDenominationScroll.page.info();
                        //    tbusrpIndex = parseInt(info.page) + 1;
                        //});
                        //$('#grdDenominationScroll tbody').on('click', 'tr', function () {
                        //    $.emsyne.Utility.rowSelect($(this), ObjgrdDenominationScroll, "");
                        //});
                        //$('#grdDenominationScroll').on('length.dt', function (e, settings, len) {
                        //    tbusrpIndex = 1;
                        //    ObjgrdDenominationScroll.ajax.reload(null, true);
                        //});
                    }
                },
            ],
            "data": tReturn.ResultSet0.ResultSet,
            "columns": JSON.parse(JSON.stringify(adColumns)),
            'rowCallback': function (row, data, index) {
                var i = -2;
                $.each(data, function (ind, val) {
                    // console.log(ind);
                    //console.log(ind.indexOf("Deposit_"));
                    if (ind.indexOf("Deposit_") > -1) {
                        $(row).find('td:eq(' + i + ')').css('color', 'green');
                    }
                    if (ind.indexOf("Balance_") > -1) {
                        $(row).find('td:eq(' + i + ')').css('color', 'blue');
                    }
                    if (ind.indexOf("Withdraw_") > -1) {
                        $(row).find('td:eq(' + i + ')').css('color', 'red');
                    }
                    i++;
                });


            }
        });
        //debugger;
        //$('#grdTeller').removeClass('dtr-inline collapsed');
        /* $('#grdTeller').DataTable({
             "data": tReturn.ResultSet0.ResultSet,
             "columns": JSON.parse(JSON.stringify(adColumns))
         });*/
        //$(".sorting_disabled text-right").css("display", "block");
        $.TellerScroll.fnAddTransactionGridInit();
    }
    else {
        $("#divGridTeller").hide();
       // $.TellerScroll.dataBindToDefaultGrid();
        $("#divGrid").show();
    }

}
