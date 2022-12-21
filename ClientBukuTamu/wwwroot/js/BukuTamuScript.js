$(document).ready(function () {
    $('#tbTamu').DataTable({
        "ajax": {
            url: "https://localhost:44389/Api/PresenceBooks",
            type: "GET",
            "dataType": "json",
            "dataSrc": "data",
            //success: function (result) {
            //    console.log(result)
            //}
        },
        "columns": [
            {
                "render": function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "name" },
            { "data": "phone" },
            { "data": "email" },
/*            { "data": "address" },
            { "data": "provinsi" },
            { "data": "kota" },
            { "data": "kecamatan" },
            { "data": "kelurahan" },
            { "data": "kodepos" },*/
            { "data": "dateAdded" },

            {
                "render": function (data, type, row) {
                    return '<button class="btn btn-warning " data-placement="left" data-toggle="tooltip" data-animation="false" title="Edit" onclick="return GetById(' + row.id + ')"><i class="fas fa-user-edit"></i></button >' + '&nbsp;' +
                        '<button class="btn btn-danger" data-placement="right" data-toggle="tooltip" data-animation="false" title="Delete" onclick="return ConfirmDelete(' + row.id + ')"><i class="fas fa-trash-alt"></i>' + '&nbsp;' +
                        '<button id="btnDetail" class="btn btn-primary ml-1" data-placement="right" data-toggle="tooltip" data-animation="false" title="Detail" onclick="return GetDataById(' + row.id + '), selectProvinsi();"><i class="fas fa-info-circle"></i></button >'
                }
            }
        ]
    })
})


$("#addbutton").click(() => {
    $("#buttonSubmit").attr("onclick", "Save()"), $("#idTamu").hide(), $("#checkIn").hide();
    $("#buttonSubmit").attr("class", "btn btn-success");
    $("#buttonSubmit").html("Save");
    $("#nama").val("");
    $('#nama').val("");
    $('#nohp').val("");
    $('#email').val("");
    $('#alamat').val("");
    $('#province').val("");
    $('#kotabupaten').val("");
    $('#kecamata').val("");
    $('#kelurahan').val("");
    $('#kodepos').val("");
    $('#checkIn').val("");
})

function selectProvinsi() {

    $.ajax({        
        type: 'GET',
        url: "https://localhost:44389/Api/province",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var obj = result.data;
            $('#province').empty();            
            for (var i = 0; i < obj.length; i++) {
                $('#province').append('<option value="' + obj[i].prov_id + '">' + obj[i].prov_name + '</option>');
            }
        }
    });

    $("#province").change(function () {
        $('#kotabupaten').empty();
        var provinsi = $("#province").val();
        $.ajax({
            type: 'GET',
            url: "https://localhost:44389/Api/city/" + provinsi,       
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var obj = result.data;
                
                for (var i = 0; i < obj.length; i++) {
                    $('#kotabupaten').append('<option value="' + obj[i].city_id + '">' + obj[i].city_name + '</option>');
                }
            }
        });
    });

    $("#kotabupaten").change(function () {
        $('#kecamatan').empty();
        var kotabupaten = $("#kotabupaten").val();
        $.ajax({
            type: 'GET',
            url: "https://localhost:44389/Api/District/" + kotabupaten,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var obj = result.data;

                for (var i = 0; i < obj.length; i++) {
                    $('#kecamatan').append('<option value="' + obj[i].dis_id + '">' + obj[i].dis_name + '</option>');
                }
            }
        });
    });

    $("#kecamatan").change(function () {
        $('#kelurahan').empty();
        var kecamatan = $("#kecamatan").val();
        $.ajax({
            type: 'GET',
            url: "https://localhost:44389/Api/subdistrict/" + kecamatan,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var obj = result.data;

                for (var i = 0; i < obj.length; i++) {
                    $('#kelurahan').append('<option value="' + obj[i].subdis_id + '">' + obj[i].subdis_name + '</option>');
                }
            }
        });
    });

    $("#kelurahan").change(function () {
        $('#kodepos').empty();
        var kelurahan = $("#kelurahan").val();
        $.ajax({
            type: 'GET',
            url: "https://localhost:44389/Api/PostalCode/" + kelurahan,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                /*debugger;*/
                var obj = result.data;
                $('#kodepos').val(obj.postal_code);
                /*for (var i = 0; i < obj.length; i++) {                    
                    $('#kodepos').append('<option value="' + obj[i].postal_id + '">' + obj[i].postal_code + '</option>');
                }*/
            }
        });
    });

};

function Save() {
/*    debugger;*/
    var BukuTamu = new Object();
    BukuTamu.name = $('#nama').val();
    BukuTamu.phone = $('#nohp').val();
    BukuTamu.email = $('#email').val();
    BukuTamu.address = $('#alamat').val();
    BukuTamu.provinsi = $('#province').val();
    BukuTamu.kota = $('#kotabupaten').val();
    BukuTamu.kecamatan = $('#kecamatan').val();
    BukuTamu.kelurahan = $('#kelurahan').val();
    BukuTamu.kodepos = $('#kodepos').val();
    $.ajax({
        type: "POST",
        url: "https://localhost:44389/Api/PresenceBooks",
        data: JSON.stringify(BukuTamu),
        contentType: "application/json; charset=utf-8"
    }).then((result) => {
        if (result.status == 200) {
            $('#tbTamu').DataTable().ajax.reload();
            swal("Data Berhasil Dimasukkan!", "You clicked the button!", "success");
        }
        else {
            swal("Data Gagal Dimasukkan!", "You clicked the button!", "error");
        }
    })
}

function GetById(id) {
    $.ajax({
        type: "GET",
        url: "https://localhost:44389/Api/PresenceBooks/" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var obj = result.data;
            $.ajax({
                type: 'GET',
                url: "https://localhost:44389/Api/province",
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    var prov = result.data;
                    for (var i = 0; i < prov.length; i++) {
                        if (obj.prov_Id == prov[i].prov_id) {
                            $('#province').append('<option value="' + prov[i].prov_id + '" selected>' + prov[i].prov_name + '</option>');
                        } else {
                            $('#province').append('<option value="' + prov[i].prov_id + '">' + prov[i].prov_name + '</option>');
                        }
                    }
                }
            });
            $.ajax({
                type: 'GET',
                url: "https://localhost:44389/Api/city/" + obj.prov_Id,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    var city = result.data;
                    for (var i = 0; i < city.length; i++) {
                        if (obj.kota_Id == city[i].city_id)
                            $('#kotabupaten').append('<option value="' + city[i].city_id + '" selected>' + city[i].city_name + '</option>');
                        else {
                            $('#kotabupaten').append('<option value="' + city[i].city_id + '">' + city[i].city_name + '</option>');
                        }
                    }
                }
            });
            $.ajax({
                type: 'GET',
                url: "https://localhost:44389/Api/District/" + obj.kota_Id,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    var district = result.data;

                    for (var i = 0; i < district.length; i++) {
                        if (obj.kec_Id == district[i].dis_id) {
                            $('#kecamatan').append('<option value="' + district[i].dis_id + '" selected>' + district[i].dis_name + '</option>');
                        } else {
                            $('#kecamatan').append('<option value="' + district[i].dis_id + '">' + district[i].dis_name + '</option>');
                        }
                    }
                }
            });
            $.ajax({
                type: 'GET',
                url: "https://localhost:44389/Api/subdistrict/" + obj.kec_Id,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    var subdistrict = result.data;

                    for (var i = 0; i < subdistrict.length; i++) {
                        if (obj.kel_Id == subdistrict[i].subdis_id) {
                            $('#kelurahan').append('<option value="' + subdistrict[i].subdis_id + '" selected>' + subdistrict[i].subdis_name + '</option>');
                        } else {
                            $('#kelurahan').append('<option value="' + subdistrict[i].subdis_id + '">' + subdistrict[i].subdis_name + '</option>');
                        }
                    }
                }
            });
            $('#idTamu').val(obj.id);
            $('#nama').val(obj.name);
            $('#nohp').val(obj.phone);
            $('#email').val(obj.email);
            $('#alamat').val(obj.address);
            console.log(obj.prov_Id, obj.kota_Id, obj.kec_Id, obj.kel_Id);
            debugger;
            $('#province').val(obj.prov_Id);
            $('#kotabupaten').val(obj.kota_Id);
            $('#kecamatan').val(obj.kec_Id);
            $('#kelurahan').val(obj.kel_Id);
            $('#kodepos').val(obj.kodepos);
            $('#checkIn').val(obj.dateAdded);   
            $("#buttonSubmit").attr("onclick", "Update()"), $("#idTamu").hide(), $("#checkIn").hide();
            $("#buttonSubmit").attr("class", "btn btn-warning");
            $("#buttonSubmit").html("Update");
            $('#BTModal').modal('show');
        },
        error: function (errormesage) {
            swal("Data Gagal Dimasukkan!", "You clicked the button!", "error");
        }
    })
}

function Update() {
    debugger;
    var BukuTamu = new Object();
    BukuTamu.id = $('#idTamu').val();
    BukuTamu.name = $('#nama').val();
    BukuTamu.phone = $('#nohp').val();
    BukuTamu.email = $('#email').val();
    BukuTamu.address = $('#alamat').val();
    BukuTamu.provinsi = $('#province').val();
    BukuTamu.kota = $('#kotabupaten').val();
    BukuTamu.kecamatan = $('#kecamatan').val();
    BukuTamu.kelurahan = $('#kelurahan').val();
    BukuTamu.kodepos = $('#kodepos').val();
    BukuTamu.dateAdded = $('#checkIn').val();

    $.ajax({
        type: 'PUT',
        url: "https://localhost:44389/Api/PresenceBooks",
        data: JSON.stringify(BukuTamu),
        contentType: "application/json; charset=utf-8",
    }).then((result) => {
        debugger;
        if (result.status == 200) {
            $('#tbTamu').DataTable().ajax.reload();
            swal("Data Berhasil Diperbarui!", "You clicked the button!", "success");
        }
        else {
            swal("Data Gagal Diperbarui!", "You clicked the button!", "error");
        }
    });
}


function Delete(id) {
    debugger;
    $.ajax({
        url: "https://localhost:44389/Api/PresenceBooks/" + id,
        type: "DELETE",
        dataType: "json",
    }).then((result) => {
        if (result.status == 200) {
            $('#BTModal').modal('hide');
            $('#tbTamu').DataTable().ajax.reload();

            swal({
                icon: 'success',
                title: 'Deleted',
                text: 'Data Tamu Berhasil Dihapus'
            });
        }
        else {
            swal({
                icon: 'error',
                title: 'Failed',
                text: 'Gagal Menghapus Data Tamu'
            });
        }
    });
}

function ConfirmDelete(id) {
    debugger;
    swal({
        title: 'Apakah kamu yakin?',
        text: "Kamu Tidak Bisa  Mengulang Takdir yang Telah Terjadi!",
        icon: 'warning',
        buttons: true,
        dangerMode: true,
    }).then((isConfirmed) => {
        if (isConfirmed) {
            Delete(id);
            swal(
                'Dihapus!',
                'Data Berhasil Dihapus.',
                'Berhasil'
            )
        }
    })
}

function GetDataById(id) {
    $.ajax({
        type: "GET",
        url: "https://localhost:44389/Api/PresenceBooks/" + id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            var obj = result.data;
            debugger;
            $('#nama2').val(obj.name);
            $('#nohp2').val(obj.phone);
            $('#email2').val(obj.email);
            $('#alamat2').val(obj.address);
            $('#province2').val(obj.provinsi);
            $('#kotabupaten2').val(obj.kota);
            $('#kecamatan2').val(obj.kecamatan);
            $('#kelurahan2').val(obj.kelurahan);
            $('#kodepos2').val(obj.kodepos);
            $('#checkIn2').val(obj.dateAdded);
            $('#ModalDetail').modal('show');
        },
        error: function (errormesage) {
            swal("Data Gagal Dimasukkan!", "You clicked the button!", "error");
        }
    })
}