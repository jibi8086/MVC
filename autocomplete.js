
        $("#dtStartDate").datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:2100',
            minDate: 0,
            onSelect: function (d, i) {
                if (d !== i.lastVal) {

                }
            }
        });
        $("#dtEndDate").datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            yearRange: '1900:2100',
            onSelect: function (d, i) {
                if (d !== i.lastVal) {

                }
            }
        });

        $("#txtTaskName ").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/Task/LoadTaskName",
                    type: "POST",
                    async: false,
                    cache: false,
                    dataType: "json",
                  //  data: "{ 'Project':@projectId,'EmpName': '" + request.term + "',Operation:2}",
                        data: { Project:@projectId,EmpName: request.term,Operation:2 },
                    success: function (data) {
                        var items = [];
                        for (var i = 0; i < data.length; i++) {
                            items.push({ Id: data[i]["Key"], label: data[i]["Value"], value: data[i]["Value"] });
                        }
                        response($.map(items, function (item) {
                            return item;
                        }))
                    }
                })
            },
            select: function (event, ui) {
                var label = ui.item.id;
                $("#searchName").val("");
                //$.ajax({

                //    type: "POST",
                //    async: false,
                //    cache: false,
                //    url: "/UserRegister/Search",
                //    data: { SearchValue: label },
                //    success: function (response) {
                //        if (response.id == 1) {
                //            window.location.href = "/UserRegister/UserProfile";
                //        }
                //        else {

                //        }
                //    },
                //    failure: function (response) {

                //    },
                //    error: function (response) {

                //    }
                //});

            }
        });
    });

