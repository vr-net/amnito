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
        asanPardakht.application.showMessageBox('اعتبار سنجی', msg, 2);
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
function DelOrderId(orderItemId) {

    //asanPardakht.application.showConfirmBox('حذف', 'آیا از حذف مرسوله اطمینان دارید؟', 'بله', 'خیر', function () {
    checkOutModelList.splice(checkOutModelList.findIndex(v => v.Id == orderItemId), 1);
    ClearOrderDataInput();
    CreateorderItemList();
    //}, function () { });

}
function ClearOrderDataInput() {
    $('#ServiceId').val('-1');
    $('#GoodsType').val('');
    $('#Weight_g').val('');
    $('#ApproximateValue').val('');
    $('#Count').val('1');
    $('#KartonLafaf').val('کارتن نیاز ندارم.').trigger('change');
    $('#Insurance').val('* انتخاب بیمه ضروری است *').trigger('change');
    $('#ReceiverStateTown').html('');
    $('#ReciverLat').val('');
    $('#ReciverLon').val();
    $('#height').val('');
    $('#length').val('');
    $('#width').val('');
    $('#dimenationsBox').hide();
    $('#needCaton').removeAttr('checked');
    ClearAddress('Reciver');
};
function EditOrderId(orderItemId) {
    $('#checkOutModelItemId').val(orderItemId);
    ClearOrderDataInput();
    if (fillOrder()) {
        $("#wizard").steps("previous");
    }
}
function fillOrder() {
    var checkOutModelItem = checkOutModelList.find(x => x.Id == $('#checkOutModelItemId').val());
    if (checkOutModelItem) {

        $('#ServiceId').val(checkOutModelItem.ServiceId).trigger('change');
        $('#GoodsType').val(checkOutModelItem.GoodsType).trigger('change');
        $('#GoodsType').val(checkOutModelItem._GoodsType);
        $('#ApproximateValue').val(checkOutModelItem.ApproximateValue);
        $('#Weight_g').val(checkOutModelItem.Weight);
        $('#Count').val(checkOutModelItem.Count);
        $('#Insurance').val(checkOutModelItem.InsuranceName).trigger('change');
        $('#KartonLafaf').val(checkOutModelItem.CartonSizeName).trigger('change');


        var _dimensions = checkOutModelItem.length + '*' + checkOutModelItem.width + '*' + checkOutModelItem.height;
        $('#KartonLafaf').val($('#KartonLafaf').find("option:contains('" + _dimensions + "')").val()).trigger('change');
        if (checkOutModelItem.CartonSizeName && checkOutModelItem.CartonSizeName != '' && checkOutModelItem.CartonSizeName != 'کارتن نیاز ندارم.') {
            $('#needCaton').attr('checked', 'checked');
        }
        $('#length').val(checkOutModelItem.length);
        $('#width').val(checkOutModelItem.width);
        $('#height').val(checkOutModelItem.height)
        $('#boxType').val(checkOutModelItem.boxType).trigger('change');
        if (checkOutModelItem.CartonSizeName.indexOf('سایر') >= 0) {
            $('#dimenationsBox').hide();
        }
        else {
            $('#dimenationsBox').show();
        }
        return true;
    }
    return false;
}

var checkOutModelList = [];
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
        IsHeavy: false
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

            var msg = '';
            if (!$('#HasAccessToPrinter').val()) {
                msg += 'مشخص کنید که امکان پرینت فاکتور سفارش را دارید یا خیر' + ' \r\n ';
            }
           
            if (!$('#acceptRole').is(':checked'))
                msg += '* ' + 'لطفا برای ادامه تایید کنید که قوانین را خوانده و قبول دارید' + '\r\n';

            if (msg) {
                asanPardakht.application.showMessageBox('اعتبار سنجی اطلاعات ورودی', msg, '3');
                asanPardakht.application.hideLoading();
                return false;
            }

            if (checkOutModelList.length == 0) {
                asanPardakht.application.showMessageBox('بروز اشکال در کاربری سامانه', 'اطلاعاتی جهت ثبت موجود نمی باشد. مجداد اقدام به ثبت اطلاعات مرسوله کنید', 3);
                return;
            }

            if ($('#discountCouponCode').val()) {
                checkOutModelList[0].discountCouponCode = $('#discountCouponCode').val();
            }
            for (var i in checkOutModelList) {
                var item = checkOutModelList[i];
                item.RequestPrintAvatar = $('#RequestPrintAvatar').is(':checked');
                item.HasAccessToPrinter = $('#HasAccessToPrinter').val();
                item.hasNotifRequest = $('#hasNotifRequest').is(':checked');
            }
            checkOutModelList[0].IsFromAp = true;
            var sendData = JSON.stringify(checkOutModelList);
            $.ajax({
                beforeSend: function () {
                    asanPardakht.application.showLoading();
                },
                complete: function () {
                    asanPardakht.application.hideLoading();
                },
                type: "POST",
                url: "/ShipitoCheckout/SaveNewCheckOutOrder",
                data: { "JsonCheckoutModel": sendData },
                success: function (result) {
                    if (result.success == true) {

                        //asanPardakht.application.showMessageBox('ثبت موفق', 'اطلاعات شما جهت بررسی و ثبت به سامانه ارسال شد. به صفحه مشاهده صورت حساب و پرداخت هدایت خواهید شد', 2);
                        window.location = '/order/ApBillpayment?orderIds[0]=' + result.orderIds;
                    }
                    else {
                        asanPardakht.application.showMessageBox('هشدار', result.message, 3);
                        window.location = '/Ap/_startupt'
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    asanPardakht.application.showMessageBox('خطا', 'کاربر گرامی در زمان ثبت سفارش شما اشکالی به وجود آمده، لطفا ارتباط اینترنتی دستگاه خود را بررسی کنید', 4);
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
                        if (item.Text.indexOf('* انتخاب بیمه ضروری است *') >= 0) {
                            item.Text = 'بیمه پوششی';
                            $(item).attr('disabled', 'disabled');
                        }
                        $(options.InsuranceItem).append(new Option(item.Text.split('[')[0], item.Value, false, false));
                    });
                    $(options.InsuranceItem).select2({ minimumResultsForSearch: Infinity});
                    $('#ServiceId').select2({ minimumResultsForSearch: Infinity });
                    $('#ServiceId').change(function () {
                        if ($(this).val() == 654 && parseInt($('#Weight_g').val().replace(/,/g, '')) > 5000) {
                            $(this).val('655').trigger('change');
                            asanPardakht.application.showMessageBox('محدودیت سرویس', 'برای مرسوله با وزن بیشتر از 5000 گرم(5 کیلوگرم) فقط امکان ثبت سفارش با سرویس پیشتاز وجود دارد', 1);
                            return false;
                        }
                    });
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Failed to retrieve InsuranceItems.');
                }
            });
        }
        function detrminBoxDimantion() {
            var value = $(options.kartonSizeItem).val();
            if (value == 'کارتن نیاز ندارم.') {
                return;
            }
            if (parseInt($('#Weight_g').val()) > 2000 && value.indexOf('پاکت') >= 0) {
                $(options.kartonSizeItem).val('0').trigger('change');
                asanPardakht.application.showMessageBox('ابعاد', 'در مرسوله های با وزن بیشتر از 2000 گرم امکان انتخاب پاکت وجود ندارد و می بایستی از کارتن پستی مناسب استفاده شود', 1);
                return;
            }

            if (value == '0')
                return;

            if (!value.indexOf('A') >= 0)
                $('#boxType').val('بسته');
            else
                $('#boxType').val('پاکت');

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
                        if (item.Text.indexOf('نیاز') > 0) {
                            item.Text = 'حدود اندازه مرسوله(طول* عرض*ارتفاع)';
                            $(item).attr('disabled', 'disabled');
                        }
                        if (item.Text.indexOf('حباب') > 0) {
                            item.Text = item.Text.replace('پاکت حباب دار','سایز');
                        }
                        $(options.kartonSizeItem).append(new Option(item.Text, item.Value, false, false));
                    });
                    $(options.kartonSizeItem).select2({ minimumResultsForSearch: Infinity });
                    $(options.kartonSizeItem).change(function () {

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
                var opt = new Option('استان', '0', true, true);
                $(opt).attr('disabled', 'disabled');
                $(options.CountryItem).append(opt);
                $.each(data, function (id, item) {
                    $(options.CountryItem).append(new Option(item.Text, item.Value, false, false));
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
                cache: false,
                type: "GET",
                url: !options.IsHeavy ? "/ShipitoCheckout/GetStatesByCountryId" : "/ShipitoCheckout/GetUbbarStatesByCountryId",
                data: { "countryId": selectedItem },
                success: function (reuslt) {
                    if (!reuslt || reuslt.length == 0)
                        return;

                    ddlStates.html('');
                    var opt = new Option('شهرستان/منطقه', '0', true, true);
                    $(opt).attr('disabled', 'disabled');
                    ddlStates.append(opt);

                    $.each(reuslt, function (id, item) {
                        ddlStates.append(new Option(item.Text, item.Value, false, false));
                    });
                    $(options.StateItem).select2({
                        placeholder: "انتخاب شهر",
                        allowClear: true,
                        dropdownParent: $('#mapModal')
                    });

                    if ($('#tempStateName').val() != '') {
                        var stateItem = $('#tempStateName').val().split(',');
                        if ($('#State').find("option:contains('" + stateItem[0] + "')").length > 0) {
                            $('#State').val($('#State').find("option:contains('" + stateItem[0] + "')").val()).trigger('change');
                        }
                        else
                            $('#State').val($('#State').find("option:contains('" + stateItem[1] + "')").val()).trigger('change');

                        $('#tempStateName').val('');
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log('Failed to retrieve states.');
                }
            });
        }
        //====================================Load Country & State==========================================================
        //====================================Wizard========================================================================
        asanPardakht.application.callMeOnBackButtonPress(
            function () {
                if ($('#modal_help').is(':visible')) {
                    $('#modal_help').modal('hide');
                    return;
                }

                else if ($('#mapModal').is(':visible')) {
                    $('#mapModal').modal('hide');
                    return;
                }
                else if ($('#_RuleModal').is(':visible')) {
                    $('#_RuleModal').modal('hide');
                    return;
                }
                else if ($('#Rule1Modal').is(':visible')) {
                    $('#Rule1Modal').modal('hide');
                    return;
                }
                else if ($('body').css('overflow') == 'hidden') {
                    $('.checkbox_check').click();
                }
                else if ($('.editStep').is(':visible')) {
                    var step = $(this).attr('data-val');
                    $("#wizard").steps("setStep", 1);
                    $('#ReViewData').hide(250);
                    $('body').css('background', '#606062');
                    $('#orderSteps').show(250);
                    return;
                }
                else if ($('#GoodsType').is(':visible')) {
                    window.location = '/Ap/_Startupt';
                    return;
                }
                $("#wizard").steps("previous");
            });
        currentMap = new createPostMap(options.IsForegin);

        var wizard = $('#wizard').steps({
            headerTag: "h2",
            bodyTag: "section",
            transitionEffect: "fade",
            enableAllSteps: true,
            transitionEffectSpeed: 500,
            labels: {
                finish: "<div style='padding-right: 20px;' class='fa fa-arrow-left faa-horizontal' id='stepFinish'></div>تایید و ادامه",
                next: "<div style='padding-right: 20px' class='fa fa-arrow-left faa-passing-reverse'></div>تایید و ادامه",
                previous: "<div class='fa fa-arrow-right faa-horizontal'></div> بازگشت"
            },
            onStepChanging: function (vent, currentIndex, newIndex) {
                asanPardakht.application.showLoading();
                if (currentIndex < newIndex) {
                    var IsValid = validateStepItem(currentIndex, newIndex);
                    if (IsValid == false)
                        return false;
                }
                if (currentIndex == 1 && newIndex == 2) {
                    validate_SaveLocal($('#checkOutModelItemId').val());
                    CreateorderItemList();
                }

                return true;
            },
            onStepChanged: function (event, currentIndex, priorIndex) {

                //if (!(currentIndex == 1 && priorIndex == 0))
                asanPardakht.application.hideLoading();
                if (currentIndex == 2) {
                    if (!$('#HasAccessToPrinter').hasClass("select2-hidden-accessible"))
                        $('#HasAccessToPrinter').select2({ minimumResultsForSearch: Infinity });
                }
                $('body').scrollTop();
            },
            onFinishing: function (event, currentIndex) {

                var IsValid = validateStepItem(2, 3);
                if (IsValid == false)
                    return false;
                return true;
            },
            onFinished: function (event, currentIndex) {
                $('#orderSteps').hide(250);
                $('body').css('background', '#FFFFFF');
                $('#ReViewData').show(250);
            }
        });
        CreateorderItemList = function () {
            var $OrderList = $('#OrdersList');
            $OrderList.html('');
            if (!checkOutModelList || !checkOutModelList.length || checkOutModelList.length == 0) {
                return false;
            }
            var accordion = $(` <div class="col-md-12" id="OrderList_accordion" style="margin-top: 10px;padding: 7px;"></div>`);
            for (var i in checkOutModelList) {
                var item = checkOutModelList[i];
                var card = $(`<div class="card myCard">
                                        <div class="card-header">
                                            مرسوله شماره ${(parseInt(i) + 1)}
                                            <a class="orderListItem-headerBtn" data-toggle="collapse" data-parent="#OrderList_accordion" href="#collapse${(parseInt(i) + 1)}" style="color:#707070;float: left;">
                                                <i class="fa fa-ellipsis-v" aria-hidden="true" style="top:2px;float:left"></i>
                                            </a>
                                            <a class="orderListItem-headerBtn" class="ActBtn" data-val="2" tabindex="-1" style="float: left;color:#F2432E;"><i class="fa fa-trash" onClick="DelOrderId('${item.Id}')"></i></a>
                                            <a class="orderListItem-headerBtn" class="ActBtn" data-val="2" tabindex="-1" style="float: left;color:#0F9400;"><i class="fa fa-edit faa-flash" onClick="EditOrderId('${item.Id}')"></i></a>
                                        </div>
                                        <div id="collapse${(parseInt(i) + 1)}" class="collapse">
                                            <div class="card-body pad-0">
                                                <div class="container pad-0">
                                                    <div class="row">
                                                        <div class="box" style="margin-bottom:0px !important">
                                                            <div class="body_res">
                                                                <div class="row">
                                                                    <div class="col-md-3 col-xl-3 col-lg-3 col-sm-12">
                                                                        <label >نوع کالا: </label><span class="reViewData" id="_GoodsType">${item._GoodsType}</span>
                                                                    </div>
                                                                    <div class="col-md-3 col-xl-3 col-lg-3 col-sm-12">
                                                                        <label>قیمت حدودی کالا: </label><span class="reViewData" id="_ApproximateValue">${item._ApproximateValue}</span>
                                                                    </div>
                                                                    <div class="col-md-3 col-xl-3 col-lg-3 col-sm-12">
                                                                        <label>وزن : </label><span class="reViewData" id="_Weight">${item._Weight}</span>
                                                                    </div>
                                                                    <div class="col-md-3 col-xl-3 col-lg-3 col-sm-12">
                                                                        <label>تعداد : </label><span class="reViewData" id="_Count">${item._Count}</span>
                                                                    </div>
                                                                        <div class="col-md-3 col-xl-3 col-lg-3 col-sm-12">
                                                                            <label>ابعاد: </label><span class="reViewData" id="_dimensions">${item._dimensions}</span>
                                                                        </div>
                                                                        <div class="col-md-3 col-xl-3 col-lg-3 col-sm-12">
                                                                            <label>نوع بسته بندی: </label><span class="reViewData" id="_boxType">${item._boxType}</span>
                                                                        </div>
                                                                </div>
                                                                    <div class="row">
                                                                        <div class="col-md-9 col-xl-9 col-lg-9 col-sm-12">
                                                                            <div class="address-Sender">
                                                                                <label>آدرس فرستنده:</label><span class="reViewData" id="_billingAddressModel">${item._billingAddressModel}</span>
                                                                            </div>
                                                                            <div class="addres_Receiver">
                                                                                <label>آدرس گیرنده:</label><span class="reViewData" id="_shippingAddressModel">${item._shippingAddressModel}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-md-9 col-xl-9 col-lg-9 col-sm-12">
                                                                            <label>نوع سرویس:</label><span class="reViewData" id="_ServiceId">${item._ServiceId}</span>
                                                                        </div>
                                                                    </div>
                                                                        <div class="row">
                                                                            <div class="col-md-6 col-xl-6 col-lg-6 col-sm-12">
                                                                                <label>بیمه :</label><span class="reViewData" id="_InsuranceName">${item._InsuranceName}</span>
                                                                            </div>
                                                                            <div class="col-md-6 col-xl-6 col-lg-6 col-sm-12">
                                                                                <label>جعبه و بسته بندی :</label><span class="reViewData" id="_CartonSizeName">${item._CartonSizeName}</span>
                                                                            </div>
                                                                        </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`);
                accordion.append(card);
            }
            $OrderList.append(accordion);
        }
        $('#AddNewParcell').click(function () {
            $('#checkOutModelItemId').val(Math.floor((Math.random() * 500) + 1));
            ClearOrderDataInput();
            $("#wizard").steps("previous");
        });

        function loadlocation(_countryId, _StateId, AddressType) {
            if (AddressType == 'Sender') {
                if ($('#SenderLat').val() && $('#SenderLon').val())
                    return;
            }
            else if ($('#ReciverLat').val() && $('#ReciverLon').val()) {
                //getReaciverAddress().Lat = '';
                //getReaciverAddress().Lon = '';
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
                        //    getReaciverAddress().Lat = data.Lat;
                        //    getReaciverAddress().Lon = data.Lon;
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
            $('body').css('background', '#606062');
            $('#orderSteps').show(250);
            return false;
        });

        $('.editStep').click(function () {
            var step = $(this).attr('data-val');
            wizard.steps("setStep", 1);
            $('#ReViewData').hide(250);
            $('body').css('background', '#606062');
            $('#orderSteps').show(250);
        });
        //====================================Wizard========================================================================

        $('#boxType').on('change', function (e) {
            if ($(this).val() != 'بسته' && parseInt(($('#Weight_g').val()).replace(/,/g, '')) > 1000) {
                $(this).val('بسته');
                asanPardakht.application.showMessageBox('اعتبار سنجی', 'وزن بالای یک کیلو صرفا در کارتن و جعبه قابل ارسال است ', 2);
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
                    $('#_CountryDiv').show();
                    $('#_StateDiv').show();
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
                        selectitem.SenderLat = selectitem.Lat;
                        selectitem.SenderLon = selectitem.Lon;
                        $('#tehranAreaId').val(selectitem.tehranCityArea);
                        $('#isInCityArea').val(selectitem.isInCityArea);
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
                    $('#_CountryDiv').show();
                    $('#_StateDiv').show();
                    $('#_foreignCountryDiv').hide();
                    $('#_ForeginCountryCityDiv').hide();
                }
            }
        }
        $('#RequestPrintAvatar').click(function () {

            var avatarcheckbox = $(this);
            var _customerId = parseInt($(this).attr('data-customerId'));
            if ($(this).is(':checked')) {
                var avatarStatus = $(this).attr('data-val');
                if (avatarStatus == 3)
                    return true;
                else if (avatarStatus == 2) {
                    asanPardakht.application.showMessageBox('چاپ نشان تجاری', 'کاربر گرامی نشان تجاری شما در نوبت بررسی قرار دارد', 2);
                    $(this).removeAttr('checked');
                    return false;
                }
                else if (avatarStatus == 1) {
                    asanPardakht.application.fileManager.upload('https://postex.ir/api/customer/UploadAvatar'
                        , {}
                        , { cusotmerId: _customerId }
                        , 'تصویر پروفایل / لوگوی تجاری'
                        , 'در صورتی که در تصویر لوگوی تجاری خود را در این قسمت بارگذاری کنید، می توانید پس از تایید و در زمان ثبت سفارش های بعدی آن را بر روی فاکتور پستی خود چاپ کنید'
                        , asanPardakht.application.fileManager.types.image
                        , '.jpg,.jpeg,.bmp'
                        , (5 * 1024)
                        , null
                        , 500
                        , 500
                        , 100
                        , 100
                        , function (data) {
                            try {
                                if (data.errorCode == 0) {
                                    asanPardakht.application.showMessageBox("تایید", "بارگذاری با موفقیت انجام شد. بعد از تایید تصویر بارگذاری شده توسط تیم پشتیبانی، می توانید از آن برای چاپ بر روی فاکتور سفارش خود استفاده نمایید", 1);
                                }
                                else if (data.message) {
                                    asanPardakht.application.showMessageBox("خطا", data.message, 2);
                                }
                                else
                                    asanPardakht.application.showMessageBox("خطا", 'در زمان آپلود فایل خطایی بوجود آمد.لطفا مجددا تلاش کنید', 2);
                            }
                            catch (ex) {
                                asanPardakht.application.showMessageBox("خطا", err.message, 2);
                            }
                            $(avatarcheckbox).removeAttr('checked');
                            return false;
                        }, function (data) {
                            // alert(JSON.stringify(data));
                            try {
                                var msg = '';
                                if (data.errorCode == -1) {
                                    msg = 'لطفاً ارتباط خود را چک کنید';
                                }
                                else if (data.errorCode == -2) {
                                    msg = 'خطای داخلی سیستم';
                                }
                                else if (data.errorCode == -3) {
                                    msg = 'لطفاً ارتباط خود را چک کنید (timeout)';
                                }
                                else if (data.errorCode == -4) {
                                    msg = 'خطای نامشخص';
                                }
                                if (msg != '')
                                    asanPardakht.application.showMessageBox("خطا", msg, 2);
                                $(avatarcheckbox).removeAttr('checked');
                                return false;
                            }
                            catch (ex) {
                                console.log(err.message);
                            }
                        });
                }
            }

        });
        $('#ContinueAddress').click(function () {
            currentMarker.setIcon($('#addressType').val() == 'Sender' ? normalSenderMarker : normalReciverMarker);
            SetLocationData(currentMarker.getLatLng());
        });
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
                if ($(options.CountryItem).val() == '0' || $(options.CountryItem).val() == '' || $(options.CountryItem).val() == '-1') {
                    msg = 'استان فرستنده را مشخص نمایید' + '\r\n';
                }
                if ($(options.StateItem).val() == '0' || $(options.StateItem).val() == '' || $(options.StateItem).val() == '-1') {
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
                        asanPardakht.application.showLoading();;
                    },
                    complete: function () {
                        asanPardakht.application.hideLoading();;
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
                msg = 'وارد کردن نام الزامی می باشد' + '\r\n';
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
                asanPardakht.application.showMessageBox('اعتبار سنجی', msg, 2);
                //openSidePanel();
                return;
            }

            if ($('#addressType').val() == 'Sender') {
                $('#tehranAreaId').val(getTehranAreaFromLayer({ lat: parseFloat($SenderLat.val()), lng: parseFloat($SenderLon.val()) }));
                $('#isInCityArea').val(isInCityAreaFromLayer({ lat: parseFloat($SenderLat.val()), lng: parseFloat($SenderLon.val()) }));

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
                    isInCityArea: $('#isInCityArea').val()

                };
                senderAddress.text = (senderAddress.CountryName + ' ' + senderAddress.StateProvinceName + ' ' + senderAddress.Address1 + ' ' + senderAddress.ZipPostalCode + ' ' + (senderAddress.Company) + ' '
                    + senderAddress.FirstName + ' ' + senderAddress.LastName + ' ' + (senderAddress.PhoneNumber));
                $('#SenderStateTown').html(senderAddress.text);
                //if (!$('#oldAddress').val()) {
                $('#AddressBox').append(new Option(senderAddress.text, '-2', true, true));
                //}
            }
            else {

                SetReceiverAddress({
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
                    CountryName: $(options.CountryItem).find('option:selected').text(),
                    StateProvinceName: $(options.StateItem).find('option:selected').text()
                });
                if (!options.IsForegin) {
                    getReaciverAddress().text = (getReaciverAddress().CountryName + ' ' + getReaciverAddress().StateProvinceName + ' ' + getReaciverAddress().Address1 + ' ' + getReaciverAddress().ZipPostalCode + ' ' + (getReaciverAddress().Company) + ' ' + getReaciverAddress().FirstName + ' '
                        + getReaciverAddress().LastName + ' ' + (getReaciverAddress().PhoneNumber))
                }
                else {
                    getReaciverAddress().text = (getReaciverAddress().ForeginCountryName + ' ' + getReaciverAddress().ForeginCityName + ' ' + getReaciverAddress().Address1 + ' ' + getReaciverAddress().ZipPostalCode + ' ' + (getReaciverAddress().Company) + ' ' + getReaciverAddress().FirstName + ' '
                        + getReaciverAddress().LastName + ' ' + (getReaciverAddress().PhoneNumber))
                }
                $('#ReceiverStateTown').html(getReaciverAddress().text);
                //if (!$('#AddressBox').val()) {
                $('#AddressBox').append(new Option(getReaciverAddress().text, '-2', true, true));
                //}
            }
            $('#mapModal').modal('hide');
        });

        //====================================Addresses=====================================================================
        $('#cleanAddressItem').click(function () {
            ClearAddress($('#addressType').val());
            $('#mapModal').modal('hide');
        });
        $('.get-btn-map, .get-btn-map_i').click(function () {
            $('#addressType').val($(this).attr('data-val'));
            $('#newOldAddress').val($(this).attr('data-type'));
            if ($('#newOldAddress').val() == 'newAddress') {
                ClearAddress($('#addressType').val());

            }
            SwitchToMapBox();
            if ($(this).attr('data-val') == 'Sender') {
                if ($(this).attr('data-type') == 'OldAddress')
                    $('#MapAddressModalLabel').html('انتخاب آدرس قبلی فرستنده');
                else if ($(this).attr('data-type') == 'newAddress')
                    $('#MapAddressModalLabel').html('ثبت آدرس جدید فرستنده');
            }
            else {
                if ($(this).attr('data-type') == 'OldAddress')
                    $('#MapAddressModalLabel').html('انتخاب آدرس قبلی گیرنده');
                else if ($(this).attr('data-type') == 'newAddress')
                    $('#MapAddressModalLabel').html('ثبت آدرس جدید گیرنده');
            }
            $('#mapModal').appendTo("body");
            $('#mapModal').modal('show', { backdrop: 'static' });
            $('#addressType').val($(this).attr('data-val'));
            $('[data-toggle="tooltip"], .tooltip').tooltip("hide");

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
                $('#ServiceId')
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
                            SetReceiverAddress(selectedAddressitem[0]);
                            fillAddress(getReaciverAddress(), 'Reciver');
                        }
                        $('#mapBox').hide(250);
                        $('#AddressContent').show(250);
                        $('#_NewAddress').show(250);
                        $('#oldAddressbox').hide(250);
                    }
                });
            }

            showAndFillAddress($('#newOldAddress').val());
            $('path').each(function () { $(this).hide() });
        });
        $('#searchOldAddress').click(function () {
            $('#mapBox').hide(250);
            $('#AddressContent').show(250);
            if (($('#addressType').val() == 'Sender' && senderAddress)
                || (($('#addressType').val() != 'Sender' && getReaciverAddress()))) {
                $('#AddressBox').empty().trigger('change');
                if ($('#addressType').val() == 'Sender' && senderAddress)
                    $('#AddressBox').append(new Option(senderAddress.text, '-2', true, true));
                else if ($('#addressType').val() != 'Sender' && getReaciverAddress())
                    $('#AddressBox').append(new Option(getReaciverAddress().text, '-2', true, true));

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

        function showAndFillAddress(addressType) {
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

            var _address = (_addressType == 'Sender' ? senderAddress : getReaciverAddress());

            var lat = (_address ? (_address.Lat ? _address.Lat : (_addressType == 'Sender' ? _senderLattxt : _ReciverLattxt))
                : (_addressType == 'Sender' ? _senderLattxt : _ReciverLattxt));

            var lon = (_address ? (_address.Lon ? _address.Lon : (_addressType == 'Sender' ? _senderLontxt : _ReciverLontxt))
                : (_addressType == 'Sender' ? _senderLontxt : _ReciverLontxt));
            $.fn.modal.Constructor.prototype.enforceFocus = function () { };
            if (addressType != 'newAddress')
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
            if ($('#addressType').val() == 'Sender' && senderAddress.CountryId) {
                $('#Country').val(senderAddress.CountryId).trigger('change');
            }
            else if ($('#addressType').val() != 'Sender' && getReaciverAddress().CountryId) {
                $('#Country').val(getReaciverAddress().CountryId).trigger('change');
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
            else if ($('#addressType').val() != 'Sender' && getReaciverAddress().StateProvinceId) {
                $('#State').val(getReaciverAddress().CountryId).trigger('change');
            }
        }
        function initAddressboxDropdown() {

        }
    };
    this.construct(options);
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
        if (!getReaciverAddress()) {
            msg = 'آدرس گیرنده به درستی وارد نشده' + ' \r\n ';
        }
        if (msg) {
            asanPardakht.application.showMessageBox('اعتبار سنجی اطلاعات ورودی', msg, '3');
            return;
        }

        var checkOutModelItem = checkOutModelList.find(x => x.Id == checkOutModelItemId);
        if (checkOutModelItem) {

            checkOutModelItem.Id = checkOutModelItemId;
            checkOutModelItem.ServiceId = $('#ServiceId').val();
            var slaName = '';//SetviceType.next();
            var servicePrice = '';//slaName.next();
            checkOutModelItem._ServiceId = $('#ServiceId option:selected').text();//SetviceType.text().trim() + ' ، ' + slaName.text().trim() + ' , ' + servicePrice.text().trim();
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
            checkOutModelItem._Weight = $('#Weight_g').val() + (options.IsHeavy ? " تن " : " گرم ");;
            checkOutModelItem.Count = $('#Count').val();
            checkOutModelItem._Count = $('#Count').val();
            checkOutModelItem.InsuranceName = $('#Insurance').val();
            checkOutModelItem._InsuranceName = $('#Insurance option:selected').text();
            checkOutModelItem.CartonSizeName = ($('#needCaton').is(':checked') ? $('#KartonLafaf').val() : $($('#KartonLafaf option').first()).val());
            checkOutModelItem._CartonSizeName = $('#KartonLafaf option:selected').text();
            checkOutModelItem.SenderLat = senderAddress.Lat;
            checkOutModelItem.SenderLon = senderAddress.Lon;
            checkOutModelItem.billingAddressModel = senderAddress;
            checkOutModelItem.isInCityArea = senderAddress.isInCityArea;
            checkOutModelItem.tehranCityArea = senderAddress.tehranCityArea;

            checkOutModelItem._billingAddressModel = senderAddress.text;
            checkOutModelItem.ReciverLat = getReaciverAddress().Lat;
            checkOutModelItem.ReciverLon = getReaciverAddress().Lon;
            checkOutModelItem.shippingAddressModel = getReaciverAddress();
            checkOutModelItem._shippingAddressModel = getReaciverAddress().text;
            checkOutModelItem.HasAccessToPrinter = !$('#HasAccessToPrinter').val();
            checkOutModelItem._HasAccessToPrinter = !$('#HasAccessToPrinter').val();
            checkOutModelItem.hasNotifRequest = $('#hasNotifRequest').is(':checked');
            checkOutModelItem._hasNotifRequest = $('#hasNotifRequest').is(':checked');
            checkOutModelItem.getItNow = $('#getItNow').is(':checked');
            checkOutModelItem._getItNow = $('#getItNow').is(':checked');
            checkOutModelItem.length = parseInt($('#length').val() == '' ? '0' : $('#length').val());
            checkOutModelItem.width = parseInt($('#width').val() == '' ? '0' : $('#width').val());
            checkOutModelItem.height = parseInt($('#height').val() == '' ? '0' : $('#height').val());
            checkOutModelItem._dimensions = checkOutModelItem.length + '*' + checkOutModelItem.width + '*' + checkOutModelItem.height;
            checkOutModelItem.boxType = $('#boxType').val();
            checkOutModelItem._boxType = $('#boxType option:selected').text();
            checkOutModelItem.RequestPrintAvatar = $('#RequestPrintAvatar').is(':checked');
            checkOutModelItem._RequestPrintAvatar = $('#RequestPrintAvatar').is(':checked');
            return checkOutModelItem;
        }
        else {
            checkOutModelItem = {};
            checkOutModelItem.Id = $('#checkOutModelItemId').val();
            checkOutModelItem.ServiceId = $('#ServiceId').val();
            var SetviceType = $('#tblServiceInfo').find('input[type=radio]:checked').parent().next()
            var slaName = SetviceType.next();
            var servicePrice = slaName.next();
            checkOutModelItem._ServiceId = SetviceType.text().trim() + ' ، ' + slaName.text().trim() + ' , ' + servicePrice.text().trim()
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
            checkOutModelItem.CartonSizeName = ($('#needCaton').is(':checked') ? $('#KartonLafaf').val() : $($('#KartonLafaf option').first()).val());
            checkOutModelItem._CartonSizeName = $('#KartonLafaf option:selected').text();


            //senderAddress.CountryId = $('#Sender_Country').val();
            //senderAddress.StateProvinceId = $('#Sender_State').val();
            checkOutModelItem.billingAddressModel = senderAddress;
            checkOutModelItem.SenderLat = senderAddress.Lat;
            checkOutModelItem.SenderLon = senderAddress.Lon;
            checkOutModelItem.isInCityArea = senderAddress.isInCityArea;
            checkOutModelItem.tehranCityArea = senderAddress.tehranCityArea;

            checkOutModelItem._billingAddressModel = senderAddress.text;

            //getReaciverAddress().CountryId = $('#receiver_Country').val();
            //getReaciverAddress().StateProvinceId = $('#receiver_State').val();
            checkOutModelItem.ReciverLat = getReaciverAddress().Lat;
            checkOutModelItem.ReciverLon = getReaciverAddress().Lon;
            checkOutModelItem.shippingAddressModel = getReaciverAddress();
            checkOutModelItem._shippingAddressModel = getReaciverAddress().text;

            checkOutModelItem.HasAccessToPrinter = !$('#HasAccessToPrinter').val();
            checkOutModelItem._HasAccessToPrinter = !$('#HasAccessToPrinter').val();
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
                checkOutModelItem.receiver_ForeginCountry = getReaciverAddress().ForeginCountryId;// شناسه کشور درپست خارجی
                checkOutModelItem.receiver_ForeginCountryName = getReaciverAddress().ForeginCountryName;// نام کشور در پست خارجی
                checkOutModelItem.receiver_ForeginCityName = getReaciverAddress().ForeginCityName;// نام کشور در پست خارجی
                checkOutModelItem.receiver_ForeginCountryNameEn = getReaciverAddress().ForeginCountryNameEn;
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


            if (!senderAddress.CountryId)
                msg += '* ' + 'استان مبدا را مشخص نمایید' + '\r\n'
            if (!senderAddress.StateProvinceId)
                msg += '* ' + 'شهر مبدا را مشخص نمایید' + '\r\n'

            if (!senderAddress.Lat || !senderAddress.Lon) {
                msg += '* ' + 'مکان فرستنده را بر روی نقشه مشخص کنید' + ' \r\n ';
            }
            if (msg != '') {
                asanPardakht.application.showMessageBox('اعتبار سنجی اطلاعات ورودی', msg, '3');
                asanPardakht.application.hideLoading();
                return false;
            }
            $('.actions li:nth-child(2)').addClass('Apactions_li_a');
            return true;
        }
        if (currentIndex == 1 && newIndex == 0) {
            $('.actions li:nth-child(2)').removeClass('Apactions_li_a');
        }
        if (currentIndex == 1 && newIndex == 2) {

            if ($('#GoodsType').val() == '')
                msg += '* ' + 'محتویات مرسوله را مشخص نمایید' + '\r\n'
            if ($('#Weight_g').val() == '' || parseInt(($('#Weight_g').val()).replace(/,/g, '')) == 0)
                msg += '* ' + 'وزن مرسوله را مشخص نمایید' + '\r\n'
            if ($('#ApproximateValue').val() == '' || parseInt(($('#ApproximateValue').val()).replace(/,/g, '')) == 0)
                msg += '* ' + 'ارزش ریالی مرسوله را مشخص نمایید' + '\r\n'
            if (!$('#Count').val() || parseInt($('#Count').val()) <= 0)
                msg += '* ' + 'تعداد را به درستی مشخص نمایید نمایید' + '\r\n'

            if ($('#boxType').val() == '-1')
                msg += '* ' + 'نوع مرسوله را مشخص نمایید' + '\r\n'

            if (!getReaciverAddress().CountryId)
                msg += '* ' + 'استان مقصد را مشخص نمایید' + '\r\n'
            if (!getReaciverAddress().StateProvinceId)
                msg += '* ' + 'شهرستان مقصد را مشخص نمایید' + '\r\n'

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


            if ((isIsland(senderAddress.StateProvinceId) && (parseInt(($('#Weight_g').val()).replace(/,/g, ''))) > 500)) {
                msg += '* ' + 'امکان ارسال  بار از جزایر ایران با وزن بیشتر از 500 گرم وجود ندارد' + '\r\n'
            }
            if ((isIsland(getReaciverAddress().StateProvinceId)) && (parseInt(($('#Weight_g').val()).replace(/,/g, ''))) > 1000) {
                msg += '* ' + 'امکان ارسال  بار به جزایر ایران با وزن بیشتر از 10000 گرم وجود ندارد' + '\r\n'
            }
            if (!getReaciverAddress().Lat || !getReaciverAddress().Lon) {
                msg += '* ' + 'مکان گیرنده را بر روی نقشه مشخص کنید' + ' \r\n ';
            }

            if ($('#ServiceId').val() == '-1')
                msg += '* ' + 'نوع سرویس را مشخص نمایید' + '\r\n';

            if (!isValidService($('#tblServiceInfo').find('input[type=radio]:checked').attr('data-val'))) {
                msg += '* ' + 'امکان ثبت سفارش در سرویس انتخابی برای شما فعال نیست، جهت استفاده از این سرویس با پشتیبانی سامانه {09422020249} تماس بگیرید' + '\r\n';
            }
            if (!options.IsAgent) {
                if ($('#Insurance').val() == '* انتخاب بیمه ضروری است *') {
                    msg += '* ' + 'انتخاب بیمه ضروری می باشد' + ' \r\n ';
                }
            }

            if (msg != '') {
                asanPardakht.application.showMessageBox('اعتبار سنجی اطلاعات ورودی', msg, '3');
                asanPardakht.application.hideLoading();
                return false;
            }
        }
        if (currentIndex == 2 && newIndex == 3) {

            //if (!options.IsHeavy && $('#ExtraRequest').is(':visible')) {
            //    if (!$('#HasAccessToPrinter').val()) {
            //        msg += 'مشخص کنید که امکان پرینت فاکتور سفارش را دارید یا خیر' + ' \r\n ';
            //    }
            //}
            //if (!$('#acceptRole').is(':checked'))
            //    msg += '* ' + 'لطفا برای ادامه تایید کنید که قوانین را خوانده و قبول دارید' + '\r\n';

            //if (msg) {
            //    asanPardakht.application.showMessageBox('اعتبار سنجی اطلاعات ورودی', msg, '3');
            //    asanPardakht.application.hideLoading();
            //    return false;
            //}
        }
    }
    function isValidService(serviceid) {
        _canCheckoutAsCod = false;
        $.ajax({
            beforeSend: function () {
                // asanPardakht.application.showLoading();
            },
            complete: function () {
                // asanPardakht.application.hideLoading();
            },
            type: "POST",
            async: false,
            url: "/ShipitoCheckout/IsvalidService",
            data: { 'serviceId': serviceid },
            success: function (data) {
                _canCheckoutAsCod = data.success;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                asanPardakht.application.showMessageBox('خطا', 'به دلیل قطع ارتباط دستگاه شما با سامانه،اعتبار سنجی امکان پذیر نیست مجددا سعی کنید', 4);
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
            textFormat: 'yyyy/MM/dd HH:mm'
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
        asanPardakht.application.showMessageBox('محدودیت های وزنی', msg, 1);
    }
    else if (name == 'dimensionsBans') {
        var msg = 'پست بار: 100 سانتیمتر*100 سانتیمتر*100 سانتیمتر';
        msg += '\r\n' + 'سرویس پست خصوصی: 300 سانتیمتر*300 سانتیمتر*300 سانتیمتر';
        msg += '\r\n' + 'سرویس درون شهری: 70 سانتیمتر*70 سانتیمتر*70 سانتیمتر';
        msg += '\r\n' + 'سرویس بین الملی: 100 سانتیمتر*100 سانتیمتر*100 سانتیمتر';
        asanPardakht.application.showMessageBox('محدودیت های ابعاد', msg, 1);
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
}
function ClearAddress(type) {
    $('#FirstName').val('');
    $('#LastName').val('');
    $('#Company').val('');
    $('#Email').val('');
    $('#PhoneNumber').val('');
    $('#ZipPostalCode').val('');
    $('#Address1').val('');
    if (type == 'Sender') {
        $('#SenderLat').val('');
        $('#SenderLon').val('');
        $('#tehranAreaId').val('');
        $('#isInCityArea').val('');
    }
    else {
        $('#ReciverLat').val('');
        $('#ReciverLon').val('');
    }
    $('#addressType').val('');
    $('#Country').val(0).trigger('change');
    $('#receiver_ForeginCountry').val(0).trigger('change');
    $('#receiver_ForeginCountryCity').val('');
}
function SwitchToAddressContent() {
    if ($('#newOldAddress').val() == 'newAddress') {
        $('#mapBox').hide(250);
        $('#AddressContent').show(250);
    }
}
function getReaciverAddress() {
    if (checkOutModelList == null || checkOutModelList.length == 0)
        return null;
    var CusrrentItemId = $('#checkOutModelItemId').val();
    var checkOutModelItem = checkOutModelList.find(x => x.Id == CusrrentItemId);
    if (!checkOutModelItem || !checkOutModelItem.shippingAddressModel)
        return null;
    return checkOutModelItem.shippingAddressModel;
}
function SetReceiverAddress(receiverAddress) {

    var CusrrentItemId = $('#checkOutModelItemId').val();
    var checkOutModelItem = checkOutModelList.find(x => x.Id == CusrrentItemId);
    if (!checkOutModelItem) {
        checkOutModelItem = {};
        checkOutModelItem.Id = CusrrentItemId;
        checkOutModelItem.shippingAddressModel = receiverAddress;
        checkOutModelList.push(checkOutModelItem);
    }
    else {
        checkOutModelItem.Id = CusrrentItemId;
        checkOutModelItem.shippingAddressModel = receiverAddress;
    }
}

function SwitchToMapBox() {
    if ($('#newOldAddress').val() == 'newAddress') {
        $('#AddressContent').hide(250);
        ClearAddress();

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
        setmapView(lat, lon, currentMap, 14);
        showMap();
    }
    else {
        $('#mapBox').hide(250);
        $('#confirmAddress').show();
        $('#ContinueAddress').hide();
        $('#AddressContent').show(250);
        $('#oldAddressbox').show(250);
        if ($('#AddressBox').val()) {
            $("#AddressBox").empty().trigger('change');
            if ($('#addressType').val() == 'Sender' && senderAddress.text) {
                $('#AddressBox').append(new Option(senderAddress.text, '-2', true, true));
                $('#_NewAddress').show(250);
                return;
            }
            if ($('#addressType').val() != 'Sender' && getReaciverAddress() && getReaciverAddress().text) {
                $('#AddressBox').append(new Option(getReaciverAddress().text, '-2', true, true));
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
        $('#confirmAddress').hide();
        $('#ContinueAddress').show();
        postMap.invalidateSize();
        $('path').each(function () { $(this).hide() });
    }, 251);
}
