confirmAddressItem = function () {
    var $firstName = $('#FirstName');
    var $lastName = $('#LastName');
    var $company = $('#Company');
    var $email = $('#Email');
    var $phoneNumber = $('#PhoneNumber');
    var $zipPostalCode = $('#ZipPostalCode');
    var $address1 = $('#Address1');
    var $SenderLat = $('#SenderLat');
    var $SenderLon = $('#SenderLon');

    var $ReciverLat = $('#ReciverLat');
    var $ReciverLon = $('#ReciverLon');

    var msg = '';

    if ($('#addressType').val() != 'Sneder' && $('#isForginRequest').val() == 'true') {
        if ($('#receiver_ForeginCountry').val() == '0') {
            msg += 'انتخاب کشور مقصد الزامی می باشد' + '\r\n';
        }
        if ($('#receiver_ForeginCountryCity').val() == '0') {
            msg += 'انتخاب شهر مقصد الزامی می باشد' + '\r\n';
        }
    }
    else {
        if ($('#Country').val() == '0')
            msg += 'انتخاب استان الزامی می باشد' + '\r\n';
        if ($('#State').val() == '0')
            msg += 'انتخاب شهر الزامی می باشد' + '\r\n';
    }


    if ($firstName.val() == '')
        msg = 'وارد کردن نام الزامی می باشد' + '\r\n';
    if ($lastName.val() == '')
        msg += 'وارد کردن نام خانوادگی الزامی می باشد' + '\r\n';
    if ($phoneNumber.val() == '')
        msg += 'وارد کردن شماره موبایل الزامی می باشد' + '\r\n';
    if ($address1.val() == '')
        msg += 'وارد کردن آدرس الزامی می باشد' + '\r\n';
    if (msg != '') {
        alert(msg);
        return;
    }

}
cancelAddressItem = function () {
    $('#mapModal').modal('hide');
}
isIsland = function (stateId) {
    var islandId = [308, 310, 314, 2259, 2272, 2274, 2275, 2319, 2278];
    return (islandId.indexOf(parseInt(stateId)) != -1);
}
var newCheckout = function (options) {
    currentMap = null;
    var defulte = {
        document: null,
        wizard: "",
        WeightItem: "",
        InsuranceItem: "",
        CountryItem: "",
        StateItem: "",
        kartonSizeItem: "",
        IsAgent: false,
        IsInCodRole: false,
        IsForegin: false,
        IsHeavy: false,
        IsCod:false
    }
    persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
    Arabic = { 0: '٠', 1: '١', 2: '٢', 3: '٣', 4: '٤', 5: '٥', 6: '٦', 7: '٧', 8: '٨', 9: '٩' };
    function traverse(el) {
        if (el.nodeType == 3) {
            var list = el.data.match(/[0-9]/g);
            if (list != null && list.length != 0) {
                for (var i = 0; i < list.length; i++) {
                    el.data = el.data.replace(list[i], persian[list[i]]);
                }
            }
        }
        for (var i = 0; i < el.childNodes.length; i++) {
            traverse(el.childNodes[i]);
        }
    }

    this.construct = function (options) {
        $('#checkOutModelItemId').val(Math.floor((Math.random() * 500) + 1));

        $.extend({}, defulte, options);
        var root = this;
        $('#btn_SaveNext').click(function () {

            if (checkOutModelList.length == 0) {
                alert('اطلاعاتی جهت ثبت موجود نمی باشد. مجداد اقدام به ثبت اطلاعات مرسوله کنید')
                return;
            }

            if ($('#discountCouponCode').val()) {
                checkOutModelList[0].discountCouponCode = $('#discountCouponCode').val();
            }
            if (checkOutModelList[0].ServiceId == 717) {
                checkOutModelList[0].HasAccessToPrinter = 'true';
                checkOutModelList[0].CartonSizeName = 'کارتن نیاز ندارم.';
                checkOutModelList[0].InsuranceName = '* انتخاب بیمه ضروری است *';
            }
            var sendData = JSON.stringify(checkOutModelList);
            $.ajax({
                beforeSend: function () {
                    $('.ajax-loading-block-window').show();
                },
                complete: function () {
                    $('.ajax-loading-block-window').hide();
                },
                type: "POST",
                url: "/ShipitoCheckout/SaveNewCheckOutOrder",
                data: { "JsonCheckoutModel": sendData },
                success: function (result) {
                    if (result.success == true) {

                        alert('اطلاعات شما جهت بررسی و ثبت به سامانه ارسال شد. به صفحه مشاهده صورت حساب و پرداخت هدایت خواهید شد');
                        window.location = '/order/billpayment?orderIds[0]=' + result.orderIds;
                    }
                    else {
                        alert(result.message);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert('کاربر گرامی در زمان ثبت سفارش شما اشکالی به وجود آمده، لطفا ارتباط اینترنتی دستگاه خود را بررسی کنید');
                }
            });
        });
        // load Insurances
        if ($($(options.InsuranceItem).find('option')).length < 2) {
            $.ajax({
                cache: true,
                type: "GET",
                url: "/ShipitoCheckout/getInsuranceItems",
                data: {},
                success: function (data) {
                    $.each(data, function (id, item) {
                        $(options.InsuranceItem).append(new Option(item.Text, item.Value, false, false));
                    });
                    $(options.InsuranceItem).select2();

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Failed to retrieve InsuranceItems.');
                }
            });
        }
        function detrminBoxDimantion() {
            var value = $(options.kartonSizeItem).val();
            debugger;
            if (parseInt($('#Weight_g').val()) > 2000 && value.indexOf('پاکت') >= 0) {
                $(options.kartonSizeItem).val('0').trigger('change');
                alert('در مرسوله های با وزن بیشتر از 2000 گرم امکان انتخاب پاکت وجود ندارد و می بایستی از کارتن پستی مناسب استفاده شود');
                return;
            }

            if (value == '0')
                return;

            if (value.indexOf('A') >= 0)
                $('#boxType').val('پاکت');
            else
                $('#boxType').val('بسته');

            if (value.indexOf('سایر') >= 0) {
                $('#dimenationsBox').show();
                $('#length').val('');
                $('#width').val('')
                $('#height').val('');
            }
            else {
                $('#dimenationsBox').hide();
                var daimantion = value.split('(')[1].replace(')', '').split('*');
                $('#length').val(daimantion[0])
                $('#width').val(daimantion[1])
                if (daimantion.length > 2)
                    $('#height').val(daimantion[2])
                else {
                    $('#height').val("2");
                }
            }
        }
        //load kartonSizeItem
        if ($($(options.kartonSizeItem).find('option')).length < 2) {
            $.ajax({
                cache: true,
                type: "GET",
                url: "/ShipitoCheckout/getKartonItems",
                data: {},
                success: function (data) {

                    $.each(data, function (id, item) {
                        //item.Text = (item.Text.startsWith('سایز') ? ' کارتن پستی ' : '') + item.Text;
                        item.Text = item.Text.indexOf('نیاز') > 0 ? 'انتخاب کنید' : item.Text;
                        $(options.kartonSizeItem).append(new Option(item.Text, item.Value, false, false));
                    });
                    $(options.kartonSizeItem).select2();
                    $(options.kartonSizeItem).change(function () {
                        debugger;
                        detrminBoxDimantion();
                    });
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('خطا در زمان بارگذاری ابعاد بسته ها.');
                }
            });
        }



        //====================================Load Country & State==========================================================
        $.ajax({
            cache: true,
            type: "GET",
            url: "/ShipitoCheckout/getCountryList",
            data: {},
            success: function (data) {
                var $Country = $(options.CountryItem);
                var $Country1 = $('#PreCountry');

                $Country.append(new Option('استان را انتخاب کنید', '0', true, true));
                $Country1.append(new Option('استان را انتخاب کنید', '0', true, true));
                $.each(data, function (id, item) {
                    $Country.append(new Option(item.Text, item.Value, false, false));
                    $Country1.append(new Option(item.Text, item.Value, false, false));
                });
                $(PreCountry).select2({
                    placeholder: "انتخاب استان",
                    allowClear: true,
                    dropdownParent: $('#mapModal')
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log('Failed to retrieve Countries.');
            }
        });
        function onCountryChange() {
            var selectedItem = $(this).val();
            var ddlStates = $(options.StateItem);
            ddlStates.html('');

            ddlStates.append(new Option('درحال بارگذاری....', '-1', true, true));
            $.ajax({
                beforeSend: function () {
                    $('.ajax-loading-block-window').show();
                },
                complete: function () {
                    $('.ajax-loading-block-window').hide();
                },
                cache: false,
                type: "GET",
                url: !options.IsHeavy ? "/ShipitoCheckout/GetStatesByCountryId" : "/ShipitoCheckout/GetUbbarStatesByCountryId",
                data: { "countryId": selectedItem,"isCod":options.IsCod },
                success: function (reuslt) {
                    ddlStates.html('');
                    ddlStates.append(new Option('انتخاب کنید....', '0', true, true));
                    $.each(reuslt, function (id, item) {
                        ddlStates.append(new Option(item.Text, item.Value, false, false));
                    });
                    $(options.StateItem).select2({
                        placeholder: "انتخاب شهر",
                        allowClear: true,
                        dropdownParent: $('#mapModal')
                    });
                    debugger;
                    if ($('#tempStateName').val() != '') {
                        var stateItem = $('#tempStateName').val().split(',');
                        if ($('#State').find("option:contains('" + stateItem[0] + "')").length > 0) {
                            $('#State').val($('#State').find("option:contains('" + stateItem[0] + "')").val()).trigger('change');
                        }
                        else {
                            $('#State').val($('#State').find("option:contains('" + stateItem[1] + "')").val()).trigger('change');
                            //alert('در حال حاضر امکان ثبت سفارش در شهر انتخابی شما وجود ندارد');
                        }

                        $('#tempStateName').val('');
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Failed to retrieve states.');
                }
            });
        }
        function onCountryChangePre() {
            var selectedItem = $(this).val();
            var ddlStates = $('#PreState');
            ddlStates.html('');
            $(options.CountryItem).val(selectedItem).trigger('change');
            loadlocationByStateChange(selectedItem);
            ddlStates.append(new Option('درحال بارگذاری....', '-1', true, true));
            $.ajax({
                cache: false,
                type: "GET",
                url: !options.IsHeavy ? "/ShipitoCheckout/GetStatesByCountryId" : "/ShipitoCheckout/GetUbbarStatesByCountryId",
                data: { "countryId": selectedItem },
                success: function (reuslt) {
                    ddlStates.html('');
                    ddlStates.append(new Option('شهر مورد نظر را انتخاب کنید', '0', true, true));
                    $.each(reuslt, function (id, item) {
                        ddlStates.append(new Option(item.Text, item.Value, false, false));
                    });
                    $(ddlStates).select2({
                        placeholder: "انتخاب شهر",
                        allowClear: true,
                        dropdownParent: $('#mapModal')
                    });
                    //if ($('#tempStateName').val() != '') {
                    //    var stateItem = $('#tempStateName').val().split(',');
                    //    if ($('#State').find("option:contains('" + stateItem[0] + "')").length > 0) {
                    //        $('#State').val($('#State').find("option:contains('" + stateItem[0] + "')").val()).trigger('change');
                    //    }
                    //    else {
                    //        $('#State').val($('#State').find("option:contains('" + stateItem[1] + "')").val()).trigger('change');
                    //        //alert('در حال حاضر امکان ثبت سفارش در شهر انتخابی شما وجود ندارد');
                    //    }

                    //    $('#tempStateName').val('');
                    //}

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Failed to retrieve states.');
                }
            });
            $('#PreState').off('changes');
            $('#PreState').on('change', function () {
                if ($(this).val()) {
                    $('#tempStateName').val($('#PreState option:selected').text());
                    $(options.StateItem).val($(this).val()).trigger('change');
                    
                    var latLng = getLocationByStateName($('#PreState option:selected').text());
                    //var latLng = $(this).val().split(',');
                    if (latLng)
                        setmapView(latLng.lat, latLng.lng, currentMap, 15);
                    else
                        alert('محل را برروی نقشه مشخص نمایید');
                }
            });
        }
        function getLocationByStateName(searchkeywords) {
            var latlng = currentMarker.getLatLng();
            var requestUrl = 'https://api.neshan.org/v1/search?term=' + searchkeywords + '&lat=' + latlng.lat + '&lng=' + latlng.lng;
            var latLng;
            $.ajax({
                beforeSend: function (request) {
                    request.setRequestHeader("Api-Key", 'service.V2F9Dx5uv23EkUsc6ceFjueZogiOusCpviy9PEDl');
                },
                complete: function () {
                },
                type: "GET",
                async: false,
                url: requestUrl,
                success: function (result) {
                    debugger;   
                    if (result && result.count > 0) {
                        if (result.items) {
                          var validLocation=  result.items.filter(function (obj) {
                              return (obj.region.includes($('#PreCountry option:selected').text()) || obj.region.includes($('#PreState option:selected').text));
                            });
                            if (validLocation) {
                                var current_Item = validLocation[0];
                                latLng = (current_Item.location ? { lat: current_Item.location.y, lng: current_Item.location.x } : {});
                            }
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {

                }
            });
            return latLng;
        }
        //====================================Load Country & State==========================================================
        //====================================Ubbar truckType & Options==========================================================
        if (options.IsHeavy) {
            $.ajax({
                cache: true,
                type: "GET",
                url: "/ShipitoCheckout/getUbbarTruckType",
                data: {},
                success: function (data) {
                    $('#UbbraTruckType').append(new Option('انتخاب کنید....', '0', true, true));
                    $.each(data, function (id, item) {
                        var option = new Option(item.Text, item.Value.split('|')[0], false, false);
                        $(option).attr('data-MaxWeight', item.Value.split('|')[1]);
                        $('#UbbraTruckType').append(option);
                    });

                    $('#UbbraTruckType').select2();
                    $('#UbbraTruckType').change(function () {

                        var selectedItem = $(this).val();
                        var vechileOptions = $('#VechileOptions');
                        vechileOptions.html('');
                        vechileOptions.append(new Option('درحال بارگذاری....', '-1', true, true));
                        $.ajax({
                            cache: false,
                            type: "GET",
                            url: "/ShipitoCheckout/getUbbarVechileOption",
                            data: { "TruckType": selectedItem },
                            success: function (reuslt) {
                                vechileOptions.html('');

                                vechileOptions.append(new Option('انتخاب کنید....', '0', true, true));
                                $.each(reuslt, function (id, item) {
                                    vechileOptions.append(new Option(item.Text, item.Value, false, false));
                                });
                                vechileOptions.select2();
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                console.log('Failed to retrieve vechileOptions.');
                            }
                        });
                    });
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Failed to retrieve Countries.');
                }
            });
        }
        //====================================Ubbar truckType & Options==========================================================
        if (options.IsForegin) {
            $.ajax({
                cache: true,
                type: "GET",
                url: "/ShipitoCheckout/getForeginCOuntry",
                data: {},
                success: function (data) {
                    $('#receiver_ForeginCountry').append(new Option('انتخاب کنید....', '0', true, true));
                    $.each(data, function (id, item) {
                        $('#receiver_ForeginCountry').append(new Option(item.Text, item.Value, false, false));
                    });

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Failed to retrieve ForeginCOuntry.');
                }
            });
        }
        //====================================Wizard========================================================================
        currentMap = new createPostMap(options.IsForegin);

        var wizard = $('#wizard').steps({
            headerTag: "h2",
            bodyTag: "section",
            transitionEffect: "fade",
            enableAllSteps: true,
            transitionEffectSpeed: 500,
            labels: {
                finish: "<div style='padding-right: 20px;' class='fa fa-arrow-left faa-horizontal' id='stepFinish'></div>تایید و بازبینی اطلاعات",
                next: "<div style='padding-right: 20px' class='fa fa-arrow-left faa-passing-reverse'></div>تایید و مرحله بعد",
                previous: "<div class='fa fa-arrow-right faa-horizontal'></div> بازگشت"
            },
            onStepChanging: function (vent, currentIndex, newIndex) {
                $('.ajax-loading-block-window').show();
                if (currentIndex < newIndex) {
                    var IsValid = validateStepItem(currentIndex, newIndex);
                    if (IsValid == false)
                        return false;
                    if (currentIndex == 1 && newIndex == 2) {

                        //distroyMap();
                        var _serviceId = $('#tblServiceInfo').find('input[type=radio]:checked').attr('data-val');
                        var CollectorServiceId = [717, 718];
                        var Post = [654, 655, 660, 661, 662, 667, 670, 698, 697, 696, 695, 694, 693, 691, 690];

                        if (CollectorServiceId.indexOf(parseInt(_serviceId)) >= 0) {
                            $('#ExtraRequest').hide();
                        }
                        else {
                            $('#ExtraRequest').show();
                        }
                        //else if (Post.indexOf(parseInt(_serviceId)) >= 0) {
                        //    currentMap = new createPostMap();
                        //}
                        //else {
                        //    currentMap = new createPrivatePostMap();
                        //}
                    }
                }
                if (currentIndex > newIndex) {
                    return true;
                }
                else if (currentIndex == 0 && newIndex == 1) {
                    // load ServicesInfo

                    if ($('#Sender_Country').val() == '1')
                        $('#pickUpNow').show();
                    else
                        $('#pickUpNow').hide();
                    // if (HasServiceInfoChange()) {

                    if (options.IsHeavy || options.IsForegin)
                        getServices(null);
                    else
                        getServices(false);

                    return true;
                }
                else if (currentIndex == 1 && newIndex == 2) {
                    if ($('#tblServiceInfo').find('input[type=radio]:checked').attr('data-IsCod') == 'true') {
                        if (confirm('آیا مبلغ کالای شما باید از گیرنده گرفته شود؟')) {
                            $('#CodGoodsPrice').val($('#ApproximateValue').val());

                        }
                        else {
                            $('#CodGoodsPrice').val('');
                        }
                    }
                }
                return true;
            },
            onStepChanged: function (event, currentIndex, priorIndex) {
                if (!(currentIndex == 1 && priorIndex == 0))
                    $('.ajax-loading-block-window').hide();
                if (currentIndex == 2) {
                    if (!options.IsHeavy) {
                        $('#_PostCoordinationData').MdPersianDateTimePicker({
                            targetTextSelector: '#PostCoordinationData',
                            disabledDays: [],
                            disableBeforeToday: true
                        });
                    }
                    var _serviceId = $('#tblServiceInfo').find('input[type=radio]:checked').attr('data-val');
                    var CollectorServiceId = [717, 718, 701];
                    if (CollectorServiceId.indexOf(parseInt(_serviceId)) >= 0) {
                        $("#wizard").steps("finish");
                    }
                }
                $('body').scrollTop();
            },
            onFinishing: function (event, currentIndex) {
                var IsValid = validateStepItem(2, 3);
                if (IsValid == false)
                    return false;
                var currentItem = validate_SaveLocal($('#checkOutModelItemId').val());
                if (!currentItem) {
                    alert('اطلاعات وارد شده دارای نقص می باشد');
                    return false;
                }
                fillReViewData(currentItem);
                return true;
            },
            onFinished: function (event, currentIndex) {
                $('#orderSteps').hide(250);
                $('body').css('background', '#FFFFFF');
                $('#ReViewData').show(250);
            }
        });
        function getServices(isCod) {
            var canNext = false;
            var isInvalidSender = false;
            $.ajax({
                beforeSend: function () {
                    $('.ajax-loading-block-window').show();
                },
                complete: function () {
                    $('.ajax-loading-block-window').hide();
                },
                type: "GET",
                async: false,
                url: "/ShipitoCheckout/IsInInvalidService",
                data: { "countryId": senderAddress.CountryId, "stateId": senderAddress.StateProvinceId },
                success: function (data) {
                    if (data.isInvalid == true) {
                        alert('در حال حاضر امکان ثبت سفارش از مبدا مورد نظر وجود ندارد');
                        isInvalidSender = true;
                        return;
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                }
            });
            if (isInvalidSender) {
                return;
            }
            var model = {
                'senderCountry': senderAddress.CountryId
                , 'senderState': senderAddress.StateProvinceId
                , 'receiverCountry': receiverAddress.CountryId
                , 'receiverState': receiverAddress.StateProvinceId
                , 'weightItem': (options.IsHeavy ? (parseInt(($('#Weight_g').val()).replace(/,/g, '')) * 1000000) : ($('#Weight_g').val()).replace(/,/g, ''))
                , 'AproximateValue': ($('#ApproximateValue').val()).replace(/,/g, '')
                , 'height': parseInt($('#height').val() == '' ? '0' : $('#height').val())
                , 'width': parseInt($('#width').val() == '' ? '0' : $('#width').val())
                , 'length': parseInt($('#length').val() == '' ? '0' : $('#length').val())
                , 'Content': $('#GoodsType').val()
                , 'IsCod': options.IsCod
                , 'ShowPrivatePost': (isInPrivatePostArea({ lat: senderAddress.Lat, lng: senderAddress.Lon }) && isInPrivatePostArea({ lat: receiverAddress.Lat, lng: receiverAddress.Lon }))
                , 'ShowDistributer': (isInCollectorArea({ lat: senderAddress.Lat, lng: senderAddress.Lon }) && isInCollectorArea({ lat: receiverAddress.Lat, lng: receiverAddress.Lon }))
                , 'IsFromAp': false
                , 'boxType': $('#boxType').val() == 'پاکت' ? 0 : 1
                , 'SenderAddress': senderAddress
                , 'ReciverAddress': receiverAddress
            };
            if (options.IsForegin) {
                model.receiver_ForeginCountry = receiverAddress.ForeginCountryId;
                model.receiver_ForeginCountryNameEn = receiverAddress.ForeginCountryNameEn;
            }
            if (options.IsHeavy) {
                model.dispatch_date = $('#dispatch_date').val();
                model.UbbraTruckType = $('#UbbraTruckType').val();
                model.VechileOptions = $('#VechileOptions').val();
                model.UbbarPackingLoad = $('#UbbarPackingLoad').val();
            }
            _model = JSON.stringify(model);
            $.ajax({
                beforeSend: function () {
                    $('.ajax-loading-block-window').show();
                },
                complete: function () {
                    $('.ajax-loading-block-window').hide();
                },
                type: "POST",
                //async: false,
                url: "/ShipitoCheckout/getServicesInfo",
                data: { "_model": _model },
                success: function (data) {

                    if ($(data).length == 0) {
                        wizard.steps("setStep", 0);
                        alert('با توجه به مقادیر ورودی شما در قسمت وزن،استان و شهرستان فرستنده و گیرنده سرویسی یافت نشد');
                        $('.ajax-loading-block-window').hide();
                        canNext = false;
                        return false;
                    }
                    canNext = true;
                    var tbody = $('#tblServiceInfo').find('tbody');

                    if ($('#serviceSort').length == 0) {
                        tbody.html('');
                        tbody.append(`<tr class="trHeader">
                                            <td colspan="2" class="selectServiceLeft">
                                                <select class="form-control" id="serviceSort" style="font-size: 9pt !important;" title="مرتب سازی سرویس ها">
                                                    <option value="1" selected="true">ارزان ترین </option>
                                                    <option value="2">سریع ترین </option>
                                                </select></td>
                                        </tr>`);

                        //$('#servicePayType').change(function () {
                        //    if ($(this).val() == "2") {
                        //        if (!options.IsHeavy && !options.IsForegin)
                        //            getServices(true);
                        //    }
                        //    else {
                        //        if (!options.IsHeavy && !options.IsForegin)
                        //            getServices(false);
                        //    }
                        //});
                        $('#serviceSort').change(function () {
                            var table = $('#tblServiceInfo');
                            var colIndex = 1;
                            var rows = [];
                            var tbody = table.find('tbody');
                            var header = null;
                            if (tbody) {

                                var i = 0
                                $(tbody).find('tr').each(function () {
                                    if (i != 0) {
                                        rows.push($(this).clone());
                                        $(this).remove();
                                    }
                                    i++;
                                });

                                if ($(this).val() == '1') {
                                    rows.sort(function (row1, row2) {

                                        return parseInt($(row1).find('input[type="radio"]').attr('data-Price')) - parseInt($(row2).find('input[type="radio"]').attr('data-Price'));
                                    });
                                }
                                else {
                                    rows.sort(function (row1, row2) {

                                        return parseInt($(row1).find('input[type="radio"]').attr('data-SLA')) - parseInt($(row2).find('input[type="radio"]').attr('data-SLA'));
                                    });
                                }
                                if (rows) {
                                    $(rows).each(function () {
                                        $(tbody).append($(this));
                                    });

                                }
                            }
                        });
                    }
                    else {
                        tbody.find('tr.data_item').each(function () { $(this).remove(); })
                    }
                    $.each(data, function (id, item) {
                        var imgName = '';
                        if ([654, 655, 667, 670, 662, 661, 660, 698, 697, 696, 695, 694, 693, 691, 690].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "POSTBAR";
                        }
                        else if ([703, 699, 705, 706].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "DTS";
                        }
                        else if ([702].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "YARBOX";
                        }
                        else if ([701].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "UBAAR";
                        }
                        else if ([707, 708].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "PDE";
                        }
                        else if ([709, 710, 711].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "TPG";
                        }
                        else if ([712, 713, 714, 715].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "CHAPAR";
                        }
                        else if ([717].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "SNAPBOX";
                        }
                        else if ([718].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "POSTEXPLUS";
                        }
                        else if ([719].indexOf(parseInt(item.ServiceId)) >= 0) {
                            imgName = "BLUESKY";
                        }
                        if (item.CanSelect) {
                            tbody.append(`<tr class="data_item">
                                            <td class="tdMinHeader">
                                               <input type="radio"  data-val="${item.ServiceId}" data-IsCod="${item.IsCod}" data-price="${item.Price}" data-SLA="${item.SLA.split('|')[1]}" name="radioGroup">
                                               <span>${item.ServiceName}</span>
                                                <img src="../ImageServiceProviderDashboard/${imgName}.png"/>
                                            </td>
                                           
                                            <td class="tdMaxHeader">
                                               ${item.ServiceName}
                                            </td>
                                            <td class="selectService selectServiceRight">${item.SLA.split('|')[0]}</td>
                                            <td class="selectService selectServiceLeft ${item.message ? `serviceDiscount` : ``}">${item.message ? `<del><span class="amount">${item.message}</span></del>` : ``}  ${item._Price} ريال</td>
                                        </tr>`);
                        }
                        else {
                            tbody.append(`<tr class="data_item">
                                            <td style="vertical-align: middle;"><input type="radio" style="display:none" data-val="${item.ServiceId}" data-IsCod="${item.IsCod}" data-price="${10000000000}" data-SLA="${50}" name="radioGroup">
                                                <img src="../ImageServiceProviderDashboard/${imgName}.png"/>
                                            </td>
                                            <td style="vertical-align: middle;">
                                               ${item.ServiceName}
                                            </td>
                                            <td style="vertical-align: middle;">-</td>
                                            <td style="vertical-align: middle;">${item._Price}</td>
                                        </tr>`);
                        }

                    });
                    $('#tblServiceInfo').parent().css('height', $('#tblServiceInfo').css('width') + 75);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    wizard.steps("setStep", 0);
                    alert('به دلیل قطع ارتباط دستگاه شما با سامانه، لیست سرویس ها دریافت نشد. مجددا سعی کنید');
                    $('.ajax-loading-block-window').hide();
                    canNext = false;
                    return false;
                }

            });
            return canNext;
        }
        function loadlocation(_countryId, _StateId, AddressType) {
            if (AddressType == 'Sender') {
                if ($('#SenderLat').val() && $('#SenderLon').val())
                    return;
            }
            else if ($('#ReciverLat').val() && $('#ReciverLon').val()) {
                //receiverAddress.Lat = '';
                //receiverAddress.Lon = '';
                //$('#ReciverLat').val('');
                //$('#ReciverLon').val('');
                return;
            }
            var postData = {
                CountryId: _countryId,
                StatePrivenceId: _StateId
            };
            $.ajax({
                cache: false,
                url: '/NewCheckout/GetLatLong',
                data: postData,
                type: "POST",
                success: function (data) {
                    if (data.Lat && data.Lon) {
                        //if (AddressType == 'Sender') {
                        //    $('#SenderLat').val(data.Lat);
                        //    $('#SenderLon').val(data.Lon);
                        //    senderAddress.Lat = data.Lat;
                        //    senderAddress.Lon = data.Lon;
                        //}
                        //else {
                        //    $('#ReciverLat').val(data.Lat);
                        //    $('#ReciverLon').val(data.Lon);
                        //    receiverAddress.Lat = data.Lat;
                        //    receiverAddress.Lon = data.Lon;
                        //}
                        setmapView(data.Lat, data.Lon, currentMap, 11);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('خطا در زمان دریافت اطلاعات مختصات');
                }
            });
        }
        function loadlocationByStateChange(_countryId) {
            var postData = {
                CountryId: _countryId
            };
            $.ajax({
                cache: false,
                url: '/NewCheckout/GetLatLong',
                data: postData,
                type: "POST",
                success: function (data) {
                    if (data.Lat && data.Lon) {
                        //if (AddressType == 'Sender') {
                        //    $('#SenderLat').val(data.Lat);
                        //    $('#SenderLon').val(data.Lon);
                        //    senderAddress.Lat = data.Lat;
                        //    senderAddress.Lon = data.Lon;
                        //}
                        //else {
                        //    $('#ReciverLat').val(data.Lat);
                        //    $('#ReciverLon').val(data.Lon);
                        //    receiverAddress.Lat = data.Lat;
                        //    receiverAddress.Lon = data.Lon;
                        //}
                        setmapView(data.Lat, data.Lon, currentMap, 11);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('خطا در زمان دریافت اطلاعات مختصات');
                }
            });
        }
        $('#bnt_gotoOrdersStep').click(function () {
            $('#ReViewData').hide(250);
            $('body').css('background', '#bae1fe');
            $('#orderSteps').show(250);
            return false;
        });
        $('.editStep').click(function () {
            var step = $(this).attr('data-val');
            wizard.steps("setStep", 1);
            $('#ReViewData').hide(250);
            $('body').css('background', '#83898d');
            $('#orderSteps').show(250);
        });
        //====================================Wizard========================================================================

        $('#boxType').on('change', function (e) {
            if ($(this).val() != 'بسته' && parseInt(($('#Weight_g').val()).replace(/,/g, '')) > 1000) {
                $(this).val('بسته');
                alert('وزن بالای یک کیلو صرفا در کارتن و جعبه قابل ارسال است ');

            }
            if ($(this).val() == 'بسته') {
                $('#height').parent().parent().parent().show();
            }
            else if (!IsForegin) {
                $('#height').parent().parent().parent().hide();
                $('#height').val('');
                $('#length').val('');
                $('#width').val('');
            }
        });

        //====================================Addresses=====================================================================
        senderAddress = {};
        receiverAddress = {};
        _senderAddressArr = [];
        _reciverAddressArr = [];




        function fillAddress(selectitem, addressType) {
            ClearAddress();

            if (selectitem) {
                $('#FirstName').val(selectitem.FirstName);
                $('#LastName').val(selectitem.LastName);
                $('#Company').val(selectitem.Company);
                $('#Email').val(selectitem.Email);
                $('#PhoneNumber').val(selectitem.PhoneNumber);
                $('#ZipPostalCode').val(selectitem.ZipPostalCode);
                $('#Address1').val(selectitem.Address1);
                $('#addressType').val(addressType);
                $('#tempStateName').val(selectitem.StateProvinceName);
                $('#Country').val(selectitem.CountryId).trigger('change');
                if ($('#addressType').val() != 'Sender' && options.IsForegin) {
                    $('#_CountryDiv').hide();
                    $('#_StateDiv').hide();
                    $('#_foreignCountryDiv').show();
                    $('#_ForeginCountryCityDiv').show();
                    $('#receiver_ForeginCountryCity').val(selectitem.ForeginCityName);
                    $('#receiver_ForeginCountry').val(selectitem.ForeginCountryId).trigger('change');
                    $(options.CountryItem).val('0').trigger('change');
                    $(options.StateItem).val('0').trigger('change');
                }
                else {
                    if ($('#newOldAddress').val() != 'newAddress') {
                        debugger;
                        $('#_CountryDiv').show();
                        $('#_StateDiv').show();
                    }
                    else {
                        $('#_CountryDiv').hide();
                        $('#_StateDiv').hide();
                    }
                    $('#_foreignCountryDiv').hide();
                    $('#_ForeginCountryCityDiv').hide();
                    //$(options.CountryItem).val(selectitem.CountryId).trigger('change');
                    //$(options.StateItem).val(selectitem.StateProvinceId).trigger('change');
                    $('#receiver_ForeginCountryCity').val('');
                    $('#receiver_ForeginCountry').val('0').trigger('change');
                }

                if (selectitem.Lat && selectitem.Lon) {
                    if ($('#addressType').val() == 'Sender') {
                        $('#SenderLat').val(selectitem.Lat);
                        $('#SenderLon').val(selectitem.Lon);
                        $('#tehranAreaId').val(selectitem.tehranCityArea);
                        $('#CollectorAreaId').val(selectitem.collectorArea),
                        $('#isInCityArea').val(selectitem.isInCityArea);
                        $('#trafficArea').val(selectitem.trafficArea);

                        selectitem.SenderLat = selectitem.Lat;
                        selectitem.SenderLon = selectitem.Lon;
                    }
                    else {
                        $('#ReciverLat').val(selectitem.Lat);
                        $('#ReciverLon').val(selectitem.Lon);
                        selectitem.ReciverLat = selectitem.Lat;
                        selectitem.ReciverLon = selectitem.Lon;
                    }
                }
                if ($('#addressType').val() == 'Sender' && selectitem.SenderLat) {
                    $('#SenderLat').val(selectitem.SenderLat);
                    $('#SenderLon').val(selectitem.SenderLon);
                }
                else if (selectitem.ReciverLat) {
                    $('#ReciverLat').val(selectitem.ReciverLat);
                    $('#ReciverLon').val(selectitem.ReciverLon);
                }
            }
            else {
                if ($('#addressType').val() != 'Sender' && options.IsForegin) {
                    $('#_CountryDiv').hide();
                    $('#_StateDiv').hide();
                    $('#_foreignCountryDiv').show();
                    $('#_ForeginCountryCityDiv').show();
                }
                else {
                    if ($('#newOldAddress').val() != 'newAddress') {
                        debugger;
                        $('#_CountryDiv').show();
                        $('#_StateDiv').show();
                    }
                    else {
                      
                        $('#_CountryDiv').hide();
                        $('#_StateDiv').hide();
                    }
                    $('#_foreignCountryDiv').hide();
                    $('#_ForeginCountryCityDiv').hide();
                }
            }
        }

        function ClearAddress() {
            $('#FirstName').val('');
            $('#LastName').val('');
            $('#Company').val('');
            $('#Email').val('');
            $('#PhoneNumber').val('');
            $('#ZipPostalCode').val('');
            $('#Address1').val('');
            //$('#SenderLat').val('');
            //$('#SenderLon').val('');
            //$('#ReciverLat').val('');
            //$('#ReciverLon').val('');
            $('#addressType').val('');
            $('#tehranAreaId').val('');
            $('#isInCityArea').val('');
            $('#CollectorAreaId').val('');
            $('#trafficArea').val('');
        }

        $('#confirmAddress').click(function () {

            var $firstName = $('#FirstName');
            var $lastName = $('#LastName');
            var $company = $('#Company');
            var $email = $('#Email');
            var $phoneNumber = $('#PhoneNumber');
            var $zipPostalCode = $('#ZipPostalCode');
            var $address1 = $('#Address1');
            var $SenderLat = $('#SenderLat');
            var $SenderLon = $('#SenderLon');

            var $ReciverLat = $('#ReciverLat');
            var $ReciverLon = $('#ReciverLon');

            var msg = '';

            if ($('#addressType').val() == 'Sender') {
                if (!$(options.CountryItem).val() || $(options.CountryItem).val() == '0' || $(options.CountryItem).val() == '' || $(options.CountryItem).val() == '-1') {
                    msg = 'استان فرستنده را مشخص نمایید' + '\r\n';
                }
                if (!$(options.StateItem).val() || $(options.StateItem).val() == '0' || $(options.StateItem).val() == '' || $(options.StateItem).val() == '-1') {
                    msg = 'شهر فرستنده را مشخص نمایید' + '\r\n';
                }
                if ($SenderLat.val() == '' || $SenderLon.val() == '') {
                    msg = 'مکان فرستنده را بر روی نقشه مشخص نمایید' + '\r\n';
                    $('#AddressContent').hide(250);
                    $('#oldAddressbox').hide();
                    showMap();
                    loadlocation($(options.countryId).val(), $(options.StateItem).val(), $('#addressType').val());
                }

            }
            else {
                if (options.IsForegin == true) {
                    if ($('#receiver_ForeginCountry').val() == '0' || $('#receiver_ForeginCountry').val() == '') {
                        msg = 'کشور گیرنده را مشخص نمایید' + '\r\n';
                    }
                    if ($('#receiver_ForeginCountryCity').val() == '') {
                        msg = 'نام شهر در کشور گیرنده را مشخص نمایید' + '\r\n';
                    }
                }
                else {
                    if ($(options.CountryItem).val() == '0' || $(options.CountryItem).val() == '' || $(options.CountryItem).val() == '-1') {
                        msg = 'استان گیرنده را مشخص نمایید' + '\r\n';
                    }
                    if ($(options.StateItem).val() == '0' || $(options.StateItem).val() == '' || $(options.StateItem).val() == '-1') {
                        msg = 'شهر گیرنده را مشخص نمایید' + '\r\n';
                    }
                }
                if ($ReciverLat.val() == '' || $ReciverLon.val() == '') {
                    msg = 'مکان گیرنده را بر روی نقشه مشخص نمایید' + '\r\n';
                    $('#AddressContent').hide(250);
                    $('#oldAddressbox').hide();
                    showMap();
                    loadlocation($(options.countryId).val(), $(options.StateItem).val(), $('#addressType').val());
                }
            }
            if ($('#addressType').val() == 'Sender' && !options.IsForegin) {

                $.ajax({
                    beforeSend: function () {
                        $('.ajax-loading-block-window').show();
                    },
                    complete: function () {
                        $('.ajax-loading-block-window').hide();
                    },
                    type: "GET",
                    async: false,
                    url: "/ShipitoCheckout/IsInInvalidService",
                    data: { "countryId": $(options.CountryItem).val(), "stateId": $(options.StateItem).val() },
                    success: function (data) {
                        if (data.isInvalid == true) {
                            msg += 'در حال حاضر امکان ثبت سفارش از مبدا مورد نظر وجود ندارد';
                            return;
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                    }
                });
            }
            if ($firstName.val() == '')
                msg += 'وارد کردن نام الزامی می باشد' + '\r\n';
            if ($lastName.val() == '')
                msg += 'وارد کردن نام خانوادگی الزامی می باشد' + '\r\n';
            if ($firstName.val().length + $lastName.val().length > 50) {
                msg += 'نام و نام خانوادگی مجموعا نمی تواند بیشترا از 50 کاراکتر باشد' + '\r\n';
            }
            if ($phoneNumber.val() == '')
                msg += 'وارد کردن شماره تماس الزامی می باشد' + '\r\n';
            if ($phoneNumber.val().length < 11)
                msg += 'شماره تماس وارد شده نامعتبر می باشد' + '\r\n';
            if ($address1.val() == '')
                msg += 'وارد کردن آدرس الزامی می باشد' + '\r\n';

            if (msg != '') {
                alert(msg);
                //openSidePanel();
                return;
            }

            if ($('#addressType').val() == 'Sender') {

                $('#tehranAreaId').val(getTehranAreaFromLayer({ lat: parseFloat($SenderLat.val()), lng: parseFloat($SenderLon.val()) }));
                $('#CollectorAreaId').val(getCollectorAreaId({ lat: parseFloat($SenderLat.val()), lng: parseFloat($SenderLon.val()) }));
                $('#isInCityArea').val(isInCityAreaFromLayer({ lat: parseFloat($SenderLat.val()), lng: parseFloat($SenderLon.val()) }));
                if ($('#newOldAddress').val() != 'newAddress') {
                    $('#trafficArea').val(isIntarfficZone({ lat: parseFloat($SenderLat.val()), lng: parseFloat($SenderLon.val()) }));
                }
                senderAddress = {
                    FirstName: $firstName.val(),
                    LastName: $lastName.val(),
                    Company: $company.val(),
                    Email: $email.val(),
                    PhoneNumber: $phoneNumber.val(),
                    ZipPostalCode: $zipPostalCode.val(),
                    Address1: $address1.val(),
                    Lat: $SenderLat.val(),
                    Lon: $SenderLon.val(),
                    CountryId: $(options.CountryItem).val(),
                    StateProvinceId: $(options.StateItem).val(),
                    CountryName: $(options.CountryItem).find('option:selected').text(),
                    StateProvinceName: $(options.StateItem).find('option:selected').text(),
                    tehranCityArea: $('#tehranAreaId').val(),
                    collectorArea: $('#CollectorAreaId').val(),
                    isInCityArea: $('#isInCityArea').val(),
                    trafficArea: $('#trafficArea').val()
                };
                senderAddress.text = (senderAddress.CountryName + ' ' + senderAddress.StateProvinceName + ' ' + senderAddress.Address1 + ' ' + senderAddress.ZipPostalCode + ' ' + (senderAddress.Company) + ' '
                    + senderAddress.FirstName + ' ' + senderAddress.LastName + ' ' + (senderAddress.PhoneNumber));
                $('#SenderStateTown').html(senderAddress.text);
                //if (!$('#oldAddress').val()) {
                $('#AddressBox').append(new Option(senderAddress.text, '-2', true, true));
                //}
            }
            else {

                receiverAddress = {
                    FirstName: $firstName.val(),
                    LastName: $lastName.val(),
                    Company: $company.val(),
                    Email: $email.val(),
                    PhoneNumber: $phoneNumber.val(),
                    ZipPostalCode: $zipPostalCode.val(),
                    Address1: $address1.val(),
                    Lat: $ReciverLat.val(),
                    Lon: $ReciverLon.val(),
                    CountryId: $(options.CountryItem).val(),
                    StateProvinceId: $(options.StateItem).val(),
                    ForeginCountryId: ($('#receiver_ForeginCountry').val() ? $('#receiver_ForeginCountry').val().split('|')[0] : null),
                    ForeginCountryNameEn: ($('#receiver_ForeginCountry').val() ? $('#receiver_ForeginCountry').val().split('|')[1] : null),
                    ForeginCountryName: $('#receiver_ForeginCountry option:selected').text(),
                    ForeginCityName: $('#receiver_ForeginCountryCity').val(),
                    CountryName: $(options.CountryItem).find('option:selected').text(),
                    StateProvinceName: $(options.StateItem).find('option:selected').text(),
                    //tehranCityArea = '',
                    //isInCityArea = ''
                };
                if (!options.IsForegin) {
                    receiverAddress.text = (receiverAddress.CountryName + ' ' + receiverAddress.StateProvinceName + ' ' + receiverAddress.Address1 + ' ' + receiverAddress.ZipPostalCode + ' ' + (receiverAddress.Company) + ' ' + receiverAddress.FirstName + ' '
                        + receiverAddress.LastName + ' ' + (receiverAddress.PhoneNumber))
                }
                else {
                    receiverAddress.text = (receiverAddress.ForeginCountryName + ' ' + receiverAddress.ForeginCityName + ' ' + receiverAddress.Address1 + ' ' + receiverAddress.ZipPostalCode + ' ' + (receiverAddress.Company) + ' ' + receiverAddress.FirstName + ' '
                        + receiverAddress.LastName + ' ' + (receiverAddress.PhoneNumber))
                }
                $('#ReceiverStateTown').html(receiverAddress.text);
                //if (!$('#AddressBox').val()) {
                $('#AddressBox').append(new Option(receiverAddress.text, '-2', true, true));
                //}
            }
            onSave();
            $('#mapModal').modal('hide');
        });

        //====================================Addresses=====================================================================

        $('.get-btn-map, .get-btn-map_i').click(function () {
            $('#addressType').val($(this).attr('data-val'));
            $('#newOldAddress').val($(this).attr('data-type'));
            SwitchToMapBox();
            if ($(this).attr('data-val') == 'Sender') {
                $('#MapAddressModalLabel').html('آدرس فرستنده');
            }
            else {
                $('#MapAddressModalLabel').html('آدرس گیرنده');
            }
            $('#mapModal').appendTo("body");
            $('#mapModal').modal('show', { backdrop: 'static' });
            $('#addressType').val($(this).attr('data-val'));
            $('[data-toggle="tooltip"], .tooltip').tooltip("hide");
            if ($('#newOldAddress').val() == 'newAddress') {
                $('#Country').prop("disabled", true);
                $('#State').prop("disabled", true);
                $('#mapBox').show();
                $('#EditAddress').hide(250);
                $('#confirmAddress').hide(250);
                $('#PreNewAddress').show(250);
                $('#ContinueAddress').show(250);
            }
            else {
                $('#Country').prop("disabled", false);
                $('#State').prop("disabled", false);
                $('#mapBox').hide(250);
                $('#EditAddress').hide(250);
                $('#confirmAddress').show(250);
                $('#PreNewAddress').hide(250);
                $('#ContinueAddress').hide(250);
            }
        });
        $('#mapModal').on('shown.bs.modal', function () {
            if ($('div.leaflet-control-container').next().length > 0) {
                $('div.leaflet-control-container').next().remove();
                $('.leaflet-control-attribution').remove();
            }

            if (!$(options.CountryItem).hasClass("select2-hidden-accessible")) {
                $(".select2-container:not(#AddressBox)").tooltip({
                    title: function () {
                        return $(this).prev().attr("title");
                    },
                    placement: "top",
                    html: true
                });
                $("#AddressBox").tooltip({
                    title: function () {
                        return $(this).prev().attr("title");
                    },
                    placement: "auto",
                    html: true
                });
                $(".myTooltip").tooltip({
                    placement: "top",
                    html: true
                });

                initCountryDropdown();
                initStateDropdown();

                $('#receiver_ForeginCountry').select2({
                    dropdownParent: $('#mapModal'),
                    allowClear: true,
                    placeholder: "انتخاب کشور گیرنده",
                });

                $('#AddressBox').select2({
                    placeholder: "قسمتی از  مشخصات یا موبایل یا آدرس قبلی را وارد کنید",
                    minimumInputLength: 4,
                    dropdownParent: $('#mapModal'),
                    ajax:
                    {
                        url: "/ShipitoCheckout/FetchAddress",
                        dataType: 'json',
                        quietMillis: 250,
                        data: function (term, page) {

                            return { 'searchtext': term.term };
                        },
                        processResults: function (data) {
                            _reciverAddressArr = data.results;
                            return {
                                results: $.map(data.results, function (e) { return { id: e.id, text: e.text } })
                            };
                        },
                        cache: false
                    }
                });

                $('#AddressBox').on('change', function (e) {

                    var id = $(this).val();
                    if (id) {
                        var selectedAddressitem = _reciverAddressArr.filter(x => x.id === id);
                        var isSender = $('#addressType').val() == 'Sender';
                        if (isSender) {
                            senderAddress = {};
                            $.extend(senderAddress, selectedAddressitem[0]);
                            fillAddress(selectedAddressitem[0], 'Sender');
                        }
                        else {
                            receiverAddress = {};
                            $.extend(receiverAddress, selectedAddressitem[0]);
                            fillAddress(selectedAddressitem[0], 'Reciver');
                        }
                        $('#mapBox').hide(250);
                        $('#AddressContent').show(250);
                        $('#_NewAddress').show(250);
                        $('#oldAddressbox').hide(250);
                    }
                });
            }
            if ($('#newOldAddress').val() == 'newAddress') 
                showAndFillAddress();
            $('path').each(function () { $(this).hide() });
        });
        $('#searchOldAddress').click(function () {
            $('#mapBox').hide(250);
            $('#AddressContent').show(250);
            if (($('#addressType').val() == 'Sender' && senderAddress)
                || (($('#addressType').val() != 'Sender' && receiverAddress))) {
                $('#AddressBox').empty().trigger('change');
                if ($('#addressType').val() == 'Sender' && senderAddress)
                    $('#AddressBox').append(new Option(senderAddress.text, '-2', true, true));
                else if ($('#addressType').val() != 'Sender' && receiverAddress)
                    $('#AddressBox').append(new Option(receiverAddress.text, '-2', true, true));

                $('#_NewAddress').show(250);
            }
            else {
                $('#_NewAddress').hide(250);
            }

            $('#oldAddressbox').show(250);
            if (!$(options.CountryItem).hasClass("select2-hidden-accessible")) {
                initCountryDropdown();
                initStateDropdown();
            }
        });
        $('#searchOnMap').click(function () {
            showMap();
            var lat, lon;
            lat = lon = null;
            if ($('#addressType').val() != 'Sender') {
                var lat = $('#ReciverLat').val();
                var lon = $('#ReciverLon').val();
            }
            else {
                var lat = $('#SenderLat').val();
                var lon = $('#SenderLon').val();
            }
            if (lat && lon)
                setmapView(lat, lon, currentMap, 14);

            $('#AddressContent').hide(250);
            $('#_NewAddress').hide(250);
            $('#oldAddressbox').hide(250);
        });
        $('#ContinueAddress').click(function () {
            SetLocationData();

        });
        $('#EditAddress').click(function () {
            $('#_NewAddress').hide(250);
            $('#oldAddressbox').hide(250);
            $('#AddressContent').hide(250);
            $('#EditAddress').hide(250);
            $('#confirmAddress').hide(250);
            $('#mapBox').show(250);
            $('#PreNewAddress').show(250);
            $('#ContinueAddress').show(250);
        });
        $('#cleanAddressItem').click(function () {
            cancelAddressItem();
        });
        function showAndFillAddress() {

            if ($('#addressType').val() != 'Sender' && !$('#addressType').attr('showAlert')) {
                $('#addressType').attr('showAlert', 'true');
                //asanPardakht.application.showMessageBox('مکان گیرنده', 'مشخص کردن مکان دقیق گیرنده بر روی نقشه الزامی نیست، مکان را به صورت حدودی(مثلا: منطقه شهری یا شهر، روستاو...) مشخص کنید', '3');
                //closeSidePanel();
            }
            var _addressType = $('#addressType').val();

            var _senderLattxt = $('#SenderLat').val();
            var _senderLontxt = $('#SenderLon').val();
            var _ReciverLattxt = $('#ReciverLat').val();
            var _ReciverLontxt = $('#ReciverLon').val();

            var _address = (_addressType == 'Sender' ? senderAddress : receiverAddress);

            var lat = (_address ? (_address.Lat ? _address.Lat : (_addressType == 'Sender' ? _senderLattxt : _ReciverLattxt))
                : (_addressType == 'Sender' ? _senderLattxt : _ReciverLattxt));

            var lon = (_address ? (_address.Lon ? _address.Lon : (_addressType == 'Sender' ? _senderLontxt : _ReciverLontxt))
                : (_addressType == 'Sender' ? _senderLontxt : _ReciverLontxt));
            $.fn.modal.Constructor.prototype.enforceFocus = function () { };
            fillAddress(_address, _addressType);
            if (navigator.geolocation && (!lat || !lon)) {
                currentMap.locate({ setView: false, maxZoom: 14 });
            }
            else
                setmapView(lat, lon, currentMap, 14);
        }

        function initCountryDropdown() {
            if ($('#Country').hasClass("select2-hidden-accessible"))
                $('#Country').select2("destroy");
            $('#Country').select2({
                placeholder: "انتخاب استان",
                allowClear: true,
                dropdownParent: $('#mapModal')
            });
            $('#Country').off('changes');
            $('#Country').on('change', onCountryChange);
            $('#PreCountry').off('changes');
            $('#PreCountry').on('change', onCountryChangePre);

            if ($('#addressType').val() == 'Sender' && senderAddress.CountryId) {
                $('#Country').val(senderAddress.CountryId).trigger('change');
            }
            else if ($('#addressType').val() != 'Sender' && receiverAddress.CountryId) {
                $('#Country').val(receiverAddress.CountryId).trigger('change');
            }
        }
        function initStateDropdown() {
            $('#State').select2({
                placeholder: "انتخاب شهر",
                allowClear: true,
                dropdownParent: $('#mapModal')
            });
            $('#State').change(function () {
                var stateId = $(this).val();
                var CountryId = $('#Country').val();
                loadlocation(CountryId, stateId, 'Sender');
            });
            if ($('#addressType').val() == 'Sender' && senderAddress.StateProvinceId) {
                $('#State').val(senderAddress.CountryId).trigger('change');
            }
            else if ($('#addressType').val() != 'Sender' && receiverAddress.StateProvinceId) {
                $('#State').val(receiverAddress.CountryId).trigger('change');
            }
        }
        function initAddressboxDropdown() {

        }
    };

    this.construct(options);
    var checkOutModelList = [];
    var _BootSideMenu = null;

    $('#AddressContent').dblclick(function (e) {
        e.stopPropagation();
    });
    $('#AddressContent').click(function (e) {
        e.stopPropagation();
    });
    $('body').on('show.bs.modal', '.modal', function (e) {
        // fix the problem of ios modal form with input field
        var $this = $(this);
        if (navigator.userAgent.match(/Android/i) && $(window).width() < 767) {
            $this.find('input').blur(function () {
                $('.modal-open').removeClass('fix-modal')
            })
                .focus(function () {
                    $('.modal-open').addClass('fix-modal')
                });
        }
    });
    //ذخیره سفارش جاری در سیستم کاربر
    function validate_SaveLocal(checkOutModelItemId) {
        var checkOutModelItem = {};
        var msg = '';
        if (!senderAddress) {
            msg = 'آدرس فرستنده به درستی وارد نشده' + ' \r\n ';
        }
        if (!receiverAddress) {
            msg = 'آدرس گیرنده به درستی وارد نشده' + ' \r\n ';
        }
        if (msg) {
            alert(msg);
            return;
        }

        var checkOutModelItem = checkOutModelList.find(x => x.Id == checkOutModelItemId);
        if (checkOutModelItem) {
            $.each(checkOutModelList, function () {

                if (this.Id == checkOutModelItemId) {

                    this.Id = checkOutModelItemId;
                    this.ServiceId = $('#tblServiceInfo').find('input[type=radio]:checked').attr('data-val');

                    var SetviceType = $('#tblServiceInfo').find('input[type=radio]:checked').parent().next()
                    var slaName = SetviceType.next();
                    var servicePrice = slaName.next();
                    this._ServiceId = SetviceType.text().trim() + ' ، ' + slaName.text().trim() + ' , ' + servicePrice.text().trim();

                    this.GoodsType = $('#GoodsType').val();
                    this._GoodsType = $('#GoodsType').val();
                    this.ApproximateValue = ($('#ApproximateValue').val()).replace(/,/g, '');
                    this._ApproximateValue = $('#ApproximateValue').val() + " ريال "
                    this.CodGoodsPrice = ($('#CodGoodsPrice').val()).replace(/,/g, '');
                    this.CodGoodsPrice = (this.CodGoodsPrice == '' ? null : this.CodGoodsPrice);
                    if ($('#AgentSaleAmount').length > 0) {
                        this.AgentSaleAmount = $('#AgentSaleAmount').val().replace(/,/g, '');
                        this.AgentSaleAmount = (this.AgentSaleAmount == '' ? 0 : this.AgentSaleAmount);
                    }
                    this.Weight = (options.IsHeavy ? (parseInt(($('#Weight_g').val()).replace(/,/g, '')) * 1000000) : ($('#Weight_g').val()).replace(/,/g, ''));
                    this._Weight = $('#Weight_g').val() + (options.IsHeavy ? " تن " : " گرم ");;
                    this.Count = $('#Count').val();
                    this._Count = $('#Count').val();
                    this.InsuranceName = $('#Insurance').val();
                    this._InsuranceName = $('#Insurance option:selected').text();
                    this.CartonSizeName = ($('#needCaton').is(':checked') ? $('#KartonLafaf').val():$($('#KartonLafaf option').first()).val());
                    this._CartonSizeName = $('#KartonLafaf option:selected').text();

                    //senderAddress.CountryId = $('#Sender_Country').val();
                    //senderAddress.StateProvinceId = $('#Sender_State').val();
                    this.SenderLat = senderAddress.Lat;
                    this.SenderLon = senderAddress.Lon;
                    this.billingAddressModel = senderAddress;
                    this.isInCityArea = senderAddress.isInCityArea;
                    this.trafficArea = (senderAddress.trafficArea ? senderAddress.trafficArea : false);
                    this.tehranCityArea = senderAddress.tehranCityArea;
                    this.collectorArea = senderAddress.collectorArea;
                    this._billingAddressModel = senderAddress.text;

                    //receiverAddress.CountryId = $('#receiver_Country').val();
                    //receiverAddress.StateProvinceId = $('#receiver_State').val();
                    this.ReciverLat = receiverAddress.Lat;
                    this.ReciverLon = receiverAddress.Lon;
                    this.shippingAddressModel = receiverAddress;
                    this._shippingAddressModel = receiverAddress.text;


                    this.HasAccessToPrinter = $('#HasAccessToPrinter').val();
                    this._HasAccessToPrinter = $('#HasAccessToPrinter').val();
                    this.hasNotifRequest = $('#hasNotifRequest').is(':checked');
                    this._hasNotifRequest = $('#hasNotifRequest').is(':checked');
                    this.getItNow = $('#getItNow').is(':checked');
                    this._getItNow = $('#getItNow').is(':checked');
                    this.length = parseInt($('#length').val() == '' ? '0' : $('#length').val());
                    this.width = parseInt($('#width').val() == '' ? '0' : $('#width').val());
                    this.height = parseInt($('#height').val() == '' ? '0' : $('#height').val());
                    this._dimensions = this.length + '*' + this.width + '*' + this.height;
                    this.boxType = $('#boxType').val();
                    this._boxType = $('#boxType option:selected').text();
                    this.RequestPrintAvatar = $('#RequestPrintAvatar').is(':checked');
                    this._RequestPrintAvatar = $('#RequestPrintAvatar').is(':checked');
                    if (options.IsForegin) {
                        this.receiver_ForeginCountry = receiverAddress.ForeginCountryId;// شناسه کشور درپست خارجی
                        this.receiver_ForeginCountryName = receiverAddress.ForeginCountryName;// نام کشور در پست خارجی
                        this.receiver_ForeginCityName = receiverAddress.ForeginCityName;// نام کشور در پست خارجی
                        this.receiver_ForeginCountryNameEn = receiverAddress.ForeginCountryNameEn;
                    }
                    if (options.IsHeavy) {
                        this.UbbarPackingLoad = $('#UbbarPackingLoad').val();// نوع بسته بندی بار سنگین
                        this._UbbarPackingLoad = $('#UbbarPackingLoad option:selected').text();// نوع بسته بندی بار سنگین

                        this.UbbraTruckType = $('#UbbraTruckType').val();// نوع خودرو بار سنگین
                        this._UbbraTruckType = $('#UbbraTruckType option:selected').text();// نوع خودرو بار سنگین

                        this.VechileOptions = $('#VechileOptions').val();// قابلیت خودرو بار سنگین
                        this._VechileOptions = $('#VechileOptions option:selected').text();// قابلیت خودرو بار سنگین
                        this.dispatch_date = $('#dispatch_date').val();
                    }
                    //this.AgentSaleAmount = $('#AgentSaleAmount').val();
                    checkOutModelItem = this;
                    return;
                }
            });
            return checkOutModelItem;
        }
        else {
            checkOutModelItem = {};
            checkOutModelItem.Id = $('#checkOutModelItemId').val();
            checkOutModelItem.ServiceId = $('#tblServiceInfo').find('input[type=radio]:checked').attr('data-val');

            var SetviceType = $('#tblServiceInfo').find('input[type=radio]:checked').parent().next()
            var slaName = SetviceType.next();
            var servicePrice = slaName.next();
            var pircetext = servicePrice.clone().find('del').remove().end().text(); 
            checkOutModelItem._ServiceId = SetviceType.text().trim() + ' ، ' + slaName.text().trim() + ' , ' + pircetext;


            checkOutModelItem.GoodsType = $('#GoodsType').val();
            checkOutModelItem._GoodsType = $('#GoodsType').val();
            checkOutModelItem.ApproximateValue = ($('#ApproximateValue').val()).replace(/,/g, '');
            checkOutModelItem._ApproximateValue = $('#ApproximateValue').val() + " ريال "

            checkOutModelItem.CodGoodsPrice = ($('#CodGoodsPrice').val()).replace(/,/g, '');
            checkOutModelItem.CodGoodsPrice = (checkOutModelItem.CodGoodsPrice == '' ? null : checkOutModelItem.CodGoodsPrice);
            if ($('#AgentSaleAmount').length > 0) {
                checkOutModelItem.AgentSaleAmount = $('#AgentSaleAmount').val().replace(/,/g, '');
                checkOutModelItem.AgentSaleAmount = (checkOutModelItem.AgentSaleAmount == '' ? 0 : checkOutModelItem.AgentSaleAmount);
            }
            checkOutModelItem.Weight = (options.IsHeavy ? (parseInt(($('#Weight_g').val()).replace(/,/g, '')) * 1000000) : ($('#Weight_g').val()).replace(/,/g, ''));
            checkOutModelItem._Weight = $('#Weight_g').val() + (options.IsHeavy ? " تن " : " گرم ");
            checkOutModelItem.Count = $('#Count').val();
            checkOutModelItem._Count = $('#Count').val();
            checkOutModelItem.InsuranceName = $('#Insurance').val();
            checkOutModelItem._InsuranceName = $('#Insurance option:selected').text();
            checkOutModelItem.CartonSizeName = ($('#needCaton').is(':checked') ? $('#KartonLafaf').val():$($('#KartonLafaf option').first()).val());
            checkOutModelItem._CartonSizeName = $('#KartonLafaf option:selected').text();

            //senderAddress.CountryId = $('#Sender_Country').val();
            //senderAddress.StateProvinceId = $('#Sender_State').val();
            checkOutModelItem.billingAddressModel = senderAddress;
            checkOutModelItem.SenderLat = senderAddress.Lat;
            checkOutModelItem.SenderLon = senderAddress.Lon;
            checkOutModelItem._billingAddressModel = senderAddress.text;
            checkOutModelItem.isInCityArea = senderAddress.isInCityArea;
            checkOutModelItem.trafficArea = (senderAddress.trafficArea ? senderAddress.trafficArea : false);;
            checkOutModelItem.tehranCityArea = senderAddress.tehranCityArea;
            checkOutModelItem.collectorArea = senderAddress.collectorArea;

            //receiverAddress.CountryId = $('#receiver_Country').val();
            //receiverAddress.StateProvinceId = $('#receiver_State').val();
            checkOutModelItem.ReciverLat = receiverAddress.Lat;
            checkOutModelItem.ReciverLon = receiverAddress.Lon;
            checkOutModelItem.shippingAddressModel = receiverAddress;
            checkOutModelItem._shippingAddressModel = receiverAddress.text;

            checkOutModelItem.HasAccessToPrinter = $('#HasAccessToPrinter').val();
            checkOutModelItem._HasAccessToPrinter = $('#HasAccessToPrinter').val();
            checkOutModelItem.hasNotifRequest = $('#hasNotifRequest').is(':checked');
            checkOutModelItem._hasNotifRequest = $('#hasNotifRequest').is(':checked');
            checkOutModelItem.getItNow = $('#getItNow').is(':checked');
            checkOutModelItem._getItNow = $('#getItNow').is(':checked');
            checkOutModelItem.length = parseInt($('#length').val());
            checkOutModelItem.width = parseInt($('#width').val());
            checkOutModelItem.height = parseInt($('#height').val());
            checkOutModelItem._dimensions = checkOutModelItem.length + '*' + checkOutModelItem.width + '*' + checkOutModelItem.height;
            checkOutModelItem.boxType = $('#boxType').val();
            checkOutModelItem._boxType = $('#boxType option:selected').text();
            checkOutModelItem.RequestPrintAvatar = $('#RequestPrintAvatar').is(':checked');
            checkOutModelItem._RequestPrintAvatar = $('#RequestPrintAvatar').is(':checked');
            if (options.IsForegin) {
                checkOutModelItem.receiver_ForeginCountry = receiverAddress.ForeginCountryId;// شناسه کشور درپست خارجی
                checkOutModelItem.receiver_ForeginCountryName = receiverAddress.ForeginCountryName;// نام کشور در پست خارجی
                checkOutModelItem.receiver_ForeginCityName = receiverAddress.ForeginCityName;// نام کشور در پست خارجی
                checkOutModelItem.receiver_ForeginCountryNameEn = receiverAddress.ForeginCountryNameEn;
            }
            if ($('#AgentSaleAmount').length > 0) {
                checkOutModelItem.AgentSaleAmount = $('#AgentSaleAmount').val().replace(/,/g, '');
                checkOutModelItem.AgentSaleAmount = (checkOutModelItem.AgentSaleAmount == '' ? 0 : checkOutModelItem.AgentSaleAmount);
            }
            if (options.IsHeavy) {
                checkOutModelItem.UbbarPackingLoad = $('#UbbarPackingLoad').val();// نوع بسته بندی بار سنگین
                checkOutModelItem._UbbarPackingLoad = $('#UbbarPackingLoad option:selected').text();// نوع بسته بندی بار سنگین

                checkOutModelItem.UbbraTruckType = $('#UbbraTruckType').val();// نوع خودرو بار سنگین
                checkOutModelItem._UbbraTruckType = $('#UbbraTruckType option:selected').text();// نوع خودرو بار سنگین

                checkOutModelItem.VechileOptions = $('#VechileOptions').val();// قابلیت خودرو بار سنگین
                checkOutModelItem._VechileOptions = $('#VechileOptions option:selected').text();// قابلیت خودرو بار سنگین
                checkOutModelItem.dispatch_date = $('#dispatch_date').val();
            }

            checkOutModelList.push(checkOutModelItem);
            return checkOutModelItem;
        }
    }
    // پر کردن اطلاعات بازبینی سفارش
    function fillReViewData(checkOutModelItem) {
        ClearViewData();
        $('#_GoodsType').text(checkOutModelItem._GoodsType);
        $('#_ApproximateValue').text(checkOutModelItem._ApproximateValue);
        $('#_Weight').text(checkOutModelItem._Weight);
        $('#_billingAddressModel').text(checkOutModelItem._billingAddressModel);
        $('#_shippingAddressModel').text(checkOutModelItem._shippingAddressModel);
        $('#_ServiceId').text(checkOutModelItem._ServiceId);
        $('#_InsuranceName').text(checkOutModelItem._InsuranceName);
        $('#_CartonSizeName').text(checkOutModelItem._CartonSizeName);
        $('#_HasAccessToPrinter').attr('checked', checkOutModelItem._HasAccessToPrinter);
        $('#_hasNotifRequest').attr('checked', checkOutModelItem._hasNotifRequest);
        $('#_getItNow').attr('checked', checkOutModelItem._getItNow);
        $('#_RequestPrintAvatar').attr('checked', checkOutModelItem._RequestPrintAvatar);
        $('#_Count').text(checkOutModelItem._Count);
        $('#_boxType').text(checkOutModelItem._boxType);
        //if (options.IsForegin)
        //    $('#receiver_ForeginCountryName').text(checkOutModelItem.receiver_ForeginCountryName);
        if (!(!checkOutModelItem._dimensions || checkOutModelItem._dimensions == '***')) {
            $('#_dimensions').text(checkOutModelItem._dimensions);
        }
        if (options.IsHeavy) {
            $('#_UbbarPackingLoad').text(checkOutModelItem._UbbarPackingLoad);
            $('#_UbbraTruckType').text(checkOutModelItem._UbbraTruckType);
            $('#_VechileOptions ').text(checkOutModelItem._VechileOptions);
            $('#_dispatch_date').text(checkOutModelItem.dispatch_date);
        }
    }
    // پاک کردن اطلاعات بازبینی سفارش
    function ClearViewData() {
        $('#_GoodsType').text('');
        $('#_ApproximateValue').text('');
        $('#_Weight').text('');
        $('#_billingAddressModel').text('');
        $('#_shippingAddressModel').text('');
        $('#_ServiceId').text('');
        $('#_InsuranceName').text('');
        $('#_CartonSizeName').text('');
        $('#_HasAccessToPrinter').removeAttr('checked');
        $('#_hasNotifRequest').removeAttr('checked');
        $('#_getItNow').removeAttr('checked');
        $('#_RequestPrintAvatar').removeAttr('checked');
        $('#_Count').text('');
        $('#_dimensions').text('');
        $('#_boxType').text('');
        $('#_RequestPrintAvatar').removeAttr('checked');
        if (options.IsForegin)
            $('#receiver_ForeginCountryName').text('');
        if (options.IsHeavy) {
            $('#_UbbarPackingLoad').text('');
            $('#_UbbraTruckType').text('');
            $('#_VechileOptions ').text('');
            $('#_dispatch_date').text('');
        }
    }
    // بررسی تغییر اطلاعات مورد نیاز جهت دریافت نوع سرویس
    function HasServiceInfoChange() {

        var checkOutModelItemId = $('#checkOutModelItemId').val();
        var checkOutModelItem = checkOutModelList.find(x => x.Id == checkOutModelItemId);
        if (!checkOutModelItem)
            return true;
        if (checkOutModelItem.shippingAddressModel.CountryId != $('#receiver_Country').val()
            || checkOutModelItem.shippingAddressModel.StateProvinceId != $('#receiver_State').val()
            || checkOutModelItem.billingAddressModel.CountryId != $('#Sender_Country').val()
            || checkOutModelItem.billingAddressModel.StateProvinceId != $('#Sender_State').val()
            || checkOutModelItem.Weight != $('#Weight_g').val())
            return true;
        return false;
    }
    // اعتبار سنجی هر مرحله از ویزارد
    function validateStepItem(currentIndex, newIndex) {
        var msg = '';
        if (currentIndex == 0 && newIndex == 1) {
            if ($('#GoodsType').val() == '')
                msg += '* ' + 'محتویات مرسوله را مشخص نمایید' + '\r\n'
            if ($('#Weight_g').val() == '' || parseInt(($('#Weight_g').val()).replace(/,/g, '')) == 0)
                msg += '* ' + 'وزن مرسوله را مشخص نمایید' + '\r\n'
            if ($('#ApproximateValue').val() == '' || parseInt(($('#ApproximateValue').val()).replace(/,/g, '')) == 0)
                msg += '* ' + 'ارزش ریالی مرسوله را مشخص نمایید' + '\r\n'
            if (!$('#Count').val() || parseInt($('#Count').val()) <= 0)
                msg += '* ' + 'تعداد را به درستی مشخص نمایید نمایید' + '\r\n'




            if (!senderAddress.CountryId)
                msg += '* ' + 'استان مبدا را مشخص نمایید' + '\r\n'
            if (!senderAddress.StateProvinceId)
                msg += '* ' + 'شهر مبدا را مشخص نمایید' + '\r\n'
            if ($(options.kartonSizeItem).val() == 'کارتن نیاز ندارم.') {
                msg += '* ' + 'لطفا حدود ابعاد مرسوله خود را انتخاب کنید' + '\r\n'
            }
            if ($(options.kartonSizeItem).val().indexOf('سایر') >= 0) {
                if ((!$('#height').val() || parseInt($('#height').val()) <= 0)
                    || (!$('#length').val() || parseInt($('#length').val()) <= 0)
                    || (!$('#width').val() || parseInt($('#width').val()) <= 0)) {
                    msg += '* ' + 'وارد کردن ابعاد برای سایز "سایر" الزامی می باشد' + '\r\n'
                }
                else if ((parseInt($('#height').val().replace(/,/g, '')) * parseInt($('#width').val().replace(/,/g, '')) * parseInt($('#length').val().replace(/,/g, ''))) < 85750) {
                    msg += '* ' + 'حداقل سایز مجاز سایز"سایر": 70*35*35 یا 35*70*35 یا 35*35*70 می باشد' + '\r\n'
                }
            }
            if ($('#boxType').val() == '-1')
                msg += '* ' + 'نوع مرسوله را مشخص نمایید' + '\r\n'
            //if (!options.IsHeavy && (parseInt(($('#Weight_g').val()).replace(/,/g, '')) > 1000 || $('#boxType').val() == 'بسته')) {
            //    if ((!$('#height').val() || parseInt($('#height').val()) <= 0)
            //        || (!$('#length').val() || parseInt($('#length').val()) <= 0)
            //        || (!$('#width').val() || parseInt($('#width').val()) <= 0)
            //    ) {
            //        msg += '* ' + 'وارد کردن ابعاد برای وزن بالاتر از 1 کیلو و بسته(کارتن،جعبه) الزامی می باشد' + '\r\n'
            //    }
            //}

            if (!options.IsForegin) {
                if (!receiverAddress.CountryId)
                    msg += '* ' + 'استان مقصد را مشخص نمایید' + '\r\n'
                if (!receiverAddress.StateProvinceId)
                    msg += '* ' + 'شهرستان مقصد را مشخص نمایید' + '\r\n'
            }
            else {
                if (!receiverAddress.ForeginCountryId) {
                    msg += '* ' + 'کشور مقصد را مشخص نمایید' + '\r\n'
                }
                if (!receiverAddress.ForeginCityName) {
                    msg += '* ' + 'نام شهر در کشور مقصد را مشخص نمایید' + '\r\n'
                }
                if ((!$('#height').val() || parseInt($('#height').val()) < 0)
                    || (!$('#length').val() || parseInt($('#length').val()) <= 0)
                    || (!$('#width').val() || parseInt($('#width').val()) <= 0)
                ) {
                    msg += '* ' + 'وارد کردن ابعاد الزامی می باشد' + '\r\n'
                }
            }
            if (!IsHeavy) {
                if ((isIsland(senderAddress.StateProvinceId) || isIsland(receiverAddress.StateProvinceId)) && (parseInt(($('#Weight_g').val()).replace(/,/g, ''))) > 500) {
                    msg += '* ' + 'امکان ارسال و دریافت بار به جزایر ایران با وزن بیشتر از 500 گرم وجود ندارد' + '\r\n'
                }
            }
            if (!senderAddress.Lat || !senderAddress.Lon) {
                msg += '* ' + 'مکان فرستنده را بر روی نقشه مشخص کنید' + ' \r\n ';
            }
            if (!receiverAddress.Lat || !receiverAddress.Lon) {
                msg += '* ' + 'مکان گیرنده را بر روی نقشه مشخص کنید' + ' \r\n ';
            }
            if (options.IsHeavy) {
                if ($('#UbbraTruckType').val() == '0') {
                    msg += '* ' + 'نوع خودرو را انتخاب نمایید' + '\r\n'
                }
                if ($('#VechileOptions').val() == '0') {
                    msg += '* ' + 'قابلیت خودرو را انتخاب نمایید' + '\r\n'
                }
                if ($('#UbbarPackingLoad').val() == '0') {
                    msg += '* ' + 'نوع بسته بندی بار خود را مشخص نمایید' + '\r\n'
                }
                if ($('#dispatch_date').val() == '')
                    msg += '* ' + 'لطفا تاریخ و ساعت بارگیری را مشخص نمایید' + '\r\n'
            }
            if (msg != '') {
                alert(msg);
                $('.ajax-loading-block-window').hide();
                return false;
            }
            return true;
        }
        if (currentIndex == 1 && newIndex == 2) {
            if ($('#tblServiceInfo').find('input[type=radio]:checked').length == 0)
                msg += '* ' + 'نوع سرویس را مشخص نمایید' + '\r\n';
            if (!$('#acceptRole').is(':checked'))
                msg += '* ' + 'لطفا برای ادامه تایید کنید که قوانین راخوانده و قبول دارید' + '\r\n';

            if (!isValidService($('#tblServiceInfo').find('input[type=radio]:checked').attr('data-val'))) {
                msg += '* ' + 'امکان ثبت سفارش در سرویس انتخابی برای شما فعال نیست، جهت استفاده از این سرویس با پشتیبانی سامانه {09422020249} تماس بگیرید' + '\r\n';
            }
            if (msg != '') {
                alert(msg);
                $('.ajax-loading-block-window').hide();
                return false;
            }
            debugger;
            var _serviceId = $('#tblServiceInfo').find('input[type=radio]:checked').attr('data-val');
            var codId = [667, 670];
            if (codId.indexOf(parseInt(_serviceId)) >= 0) {
                $('#PrinterWarpper').hide();
                $('#needCatonWrapper').hide();
                //$('#BoxNo').removeAttr('checked');
                //$('#BoxYes').attr('checked', true);
                $('#HasAccessToPrinter').val('true');
            }
            else {
                $('#PrinterWarpper').show();
                $('#needCatonWrapper').show();
                //$('#BoxNo').attr('checked', true);
                //$('#BoxYes').removeAttr('checked');
                $('#HasAccessToPrinter').val('');
            }
        }
        if (currentIndex == 2 && newIndex == 3) {

            if (!options.IsHeavy && $('#ExtraRequest').is(':visible')) {
                if (!options.IsAgent) {
                    if ($('#Insurance').val() == '* انتخاب بیمه ضروری است *') {
                        msg += '* ' + 'انتخاب بیمه ضروری می باشد' + ' \r\n ';
                    }
                }
                if (!$('#HasAccessToPrinter').val()) {
                    msg += 'مشخص کنید که امکان پرینت فاکتور سفارش را دارید یا خیر' + ' \r\n ';
                }
                if ($('#HasAccessToPrinter').val() == 'true' && $('#needCaton').is(':checked')) {
                    msg += ` کاربر گرامی، شما در مرحله اول درخواست کارتن و لفاف
بندی کردید بدین خاطر چاپ و الصاق فاکتور بر روی
بسته شما باید در مرکز پستی و یا دفتر نمایندگی انجام
شود لطفا گزینه "فاکتور سفارش رو برام چاپ و الصاق کنید"
را در قسمت امکان چاپ فاکتور انتخاب کنید `+ ' \r\n ';
                }


                //if (!$('[name="optradio"]:checked').val()) {
                //    msg += 'مشخص کنید که به کارتن پستی احتیاج دارید یا خیر ' + ' \r\n ';
                //}
                //if ($('[name="optradio"]:checked').val() == '1' && $('#KartonLafaf').val() == '0') {
                //    msg += 'لطفا سایز کارتن  پستی درخواستی را مشخص کنید ' + ' \r\n ';
                //}

            }

            if (msg) {
                alert(msg);
                $('.ajax-loading-block-window').hide();
                return false;
            }
        }
    }
    //
    function isValidService(serviceid) {
        _canCheckoutAsCod = false;
        $.ajax({
            beforeSend: function () {
                // $('.ajax-loading-block-window').show();
            },
            complete: function () {
                // $('.ajax-loading-block-window').hide();
            },
            type: "POST",
            async: false,
            url: "/ShipitoCheckout/IsvalidService",
            data: { 'serviceId': serviceid },
            success: function (data) {
                _canCheckoutAsCod = data.success;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('به دلیل قطع ارتباط دستگاه شما با سامانه،اعتبار سنجی امکان پذیر نیست مجددا سعی کنید');
                _canCheckoutAsCod = false;
            }
        });
        return _canCheckoutAsCod;
    }
    if (options.IsHeavy) {
        $('#UbbarPackingLoad').select2({ minimumResultsForSearch: Infinity });
        $('#_dispatch_date').MdPersianDateTimePicker({
            targetTextSelector: '#dispatch_date',
            disableBeforeToday: true,
            enableTimePicker: true,
            textFormat: 'yyyy/MM/dd HH:mm',
            trigger: 'focus'
        });
    }
    $(".select2-container").tooltip({
        title: function () {
            return $(this).prev().attr("title");
        },
        placement: "top",
        html: true,
        trigger: 'focus'
    });
    $(".myTooltip").tooltip({
        placement: "top",
        html: true,
        trigger: 'focus'
    });
};
function showTooltipmessage(name) {
    if (name == 'postalBans') {
        $('#modal_postalBans').appendTo("body");
        $('#modal_postalBans').modal('show', { backdrop: 'static' });
    }
    else if (name == 'weightBans') {
        var msg = 'پست بار: 30 کیلو گرم در هر بسته';
        msg += '\r\n' + 'شرکت های پستی خصوصی: 100 کیلو گرم در هر بسته';
        msg += '\r\n' + 'پست خارجی: 30 کیلو گرم در هر بسته';
        msg += '\r\n' + 'سرویس درون شهری: 20 کیلو گرم در هر بسته';
        msg += '\r\n' + 'حمل و نقل سنگین:حداکثر 20 تن';
        alert(msg);
    }
    else if (name == 'dimensionsBans') {
        var msg = 'پست بار: 100 سانتیمتر*100 سانتیمتر*100 سانتیمتر';
        msg += '\r\n' + 'سرویس پست خصوصی: 300 سانتیمتر*300 سانتیمتر*300 سانتیمتر';
        msg += '\r\n' + 'سرویس درون شهری: 70 سانتیمتر*70 سانتیمتر*70 سانتیمتر';
        msg += '\r\n' + 'سرویس بین الملی: 100 سانتیمتر*100 سانتیمتر*100 سانتیمتر';
        alert(msg);
    }
}
function SwitchToAddressContent() {
    if ($('#newOldAddress').val() == 'newAddress') {
        $('#mapBox').hide(250);
        $('#AddressContent').show(250);
    }
}
function SwitchToMapBox() {
    if ($('#newOldAddress').val() == 'newAddress') {
        $('#AddressContent').hide(250);
        //showMap();
        $('#PreNewAddress').show();
    }
    else {
        $('#mapBox').hide(250);
        $('#AddressContent').show(250);
        $('#oldAddressbox').show(250);
        if ($('#AddressBox').val()) {
            $("#AddressBox").empty().trigger('change');
            if ($('#addressType').val() == 'Sender' && senderAddress.text) {
                $('#AddressBox').append(new Option(senderAddress.text, '-2', true, true));
                $('#_NewAddress').show(250);
                return;
            }
            if ($('#addressType').val() != 'Sender' && receiverAddress.text) {
                $('#AddressBox').append(new Option(receiverAddress.text, '-2', true, true));
                $('#_NewAddress').show(250);
                return;
            }
            $('#_NewAddress').hide(250);
        }
        else {
            $('#_NewAddress').hide(250);
        }
    }
}
function showMap() {
    setTimeout(function () {
        $('#mapBox').show();
        postMap.invalidateSize();
        $('path').each(function () { $(this).hide() });
    }, 251);
}








function onSave() {

}





////**********************************************************
////**********************************************************
////**********************************************************
////**********************************************************
////**********************************************************
////**********************************************************
////**********************************************************
////**********************************************************
////**********************************************************
//Modular Map


//var Save = function () {

//}

//var MapModule = function (mapContainnerElement) {
//    IsForegin = $(mapContainnerElement).find('input[name="IsForegin"]');

//    var currentMap = new createPostMap(IsForegin);


//    ReciverLat = $(mapContainnerElement).find('input[name="ReciverLat"]');

//}