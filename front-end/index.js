var obj = new Object();
obj["id"] = localStorage.getItem("user");
if (obj["id"] == undefined) {
    window.location.href = "login.html";
}
$.when(conexion("Clientes", "select", obj)).done(function(res) {
    var clientes = new Array();
    var id_clientes = new Array();
    for (let i = 0, length1 = res.ResultSet.length; i < length1; i++) {
        id_clientes[i] = res.ResultSet[i].id;
        clientes[i] = res.ResultSet[i].nombre.toUpperCase();
    }
    var trHtml = create_tr_var(res.ResultSet);
    $("#find_meetings_tbody").append(trHtml);
    $("#find_meetings").find('tr').find('th').first().hide();
    $("#find_meetings").find('tr').each(function(index, el) {
        $(this).find('td:eq(0)').hide();
        $(this).find('td:eq(2)').html('<button type="button" class="arrange btn btn-outline btn-primary btn-sm">Arrange</button>');
    });

    $.when(conexion("Conexiones", "select", obj)).done(function(res) {
        var trHtml = "";
        var json = res.ResultSet;
        for (let i = 0, length1 = json.length; i < length1; i++) {
            trHtml += create_tr_with_id(json[i].id, json[i].id, json[i].id_cliente2, json[i].nombre, json[i].horario_inicio, json[i].horario_final, json[i].fecha, json[i].mesa);
        }
        $("#your_meetings_tbody").append(trHtml);

        $.when(conexion("Conexiones", "select_confirm", obj)).done(function(res) {
            var trHtml = "";
            var json = res.ResultSet;
            for (let i = 0, length1 = json.length; i < length1; i++) {
                trHtml += create_tr_with_id(json[i].id, json[i].id, json[i].id_cliente2, json[i].nombre, json[i].horario_inicio, json[i].horario_final, json[i].fecha, json[i].mesa, "", "");
            }
            $("#confirm_meetings_tbody").append(trHtml);
            $("#confirm_meetings").find('tr').each(function(index, el) {
                $(this).find('td').last().html('<button type="button" class="confirm btn btn-outline btn-success btn-sm">Confirm</button>');
                $(this).find('td:eq( 7 )').html('<button type="button" class="decline btn btn-outline btn-danger btn-sm">Decline</button>');
            });

            $(".confirm").click(function(event) {
                if (confirm("Are you sure you confirm this meeting?")) {
                    var obj2 = new Object();
                    obj2["id"] = $(this).closest('tr').find('td').first().text();
                    $(this).closest('tr').remove();
                    $.when(conexion("Conexiones", "save", obj2)).done(function(res) {
                        $.when(conexion("Conexiones", "select", obj)).done(function(res) {
                            var trHtml = "";
                            var json = res.ResultSet;
                            for (let i = 0, length1 = json.length; i < length1; i++) {
                                trHtml += create_tr_with_id(json[i].id, json[i].id, json[i].id_cliente2, json[i].nombre, json[i].horario_inicio, json[i].horario_final, json[i].fecha, json[i].mesa);
                            }
                            $("#your_meetings_tbody").find('tr').remove();
                            $("#your_meetings_tbody").append(trHtml);
                        });
                    });
                }
            });

            $(".decline").click(function(event) {
                if (confirm("Are you sure?")) {
                    var obj2 = new Object();
                    obj2["id"] = $(this).closest('tr').find('td').first().text();
                    $(this).closest('tr').remove();
                    $.when(conexion("Conexiones", "decline", obj2)).done(function(res) {

                    });
                }
            });

            $.when(conexion("Conexiones", "select_pending", obj)).done(function(res) {
                var trHtml = "";
                var json = res.ResultSet;
                for (let i = 0, length1 = json.length; i < length1; i++) {
                    trHtml += create_tr_with_id(json[i].id, json[i].nombre, json[i].horario_inicio, json[i].horario_final, json[i].fecha, json[i].mesa);
                }
                //$("#Pending_meetings tbody").find('tr').remove();
                $("#Pending_meetings_tbody").append(trHtml);
            });
        });
    });

    $("#time_table").addSelection({ type: "simple" });

    $(".arrange").click(function(event) {
        var reg_id = $(this).closest('tr').find('td:eq(0)').text();
        $("#Enterprise_name").val($(this).closest('tr').find('td:eq(1)').text());
        $("#Enterprise_id").val(reg_id);
        $.when(conexion("Conexiones", "horarios", obj)).done(function(res) {
            var trHtml = "";
            var json = res.ResultSet;
            for (let i = 0, length1 = json.length; i < length1; i++) {
                trHtml += create_tr_with_id("", json[i].dia, json[i].horario_inicio, json[i].horario_final);
            }
            $("#time_table").append(trHtml);
        });
        $("#dialog_arrange").dialog({
            width: 600,
            title: "Meet",
            buttons: {
                'Save': {
                    text: 'Save',
                    class: 'btn btn-success',
                    id: 'save_item_dialog'
                }
            },
            close: function(event) {

            }
        }).prev(".ui-dialog-titlebar").css("background", "#337ab7");

        $("#save_item_dialog").unbind().click(function(event) {
            var obj2 = new Object();
            obj2["id"] = "5";
            obj2["id_cliente1"] = localStorage.getItem("user");
            obj2["id_cliente2"] = reg_id;
            obj2["validacion_1"] = "true";
            obj2["validacion_2"] = "false";
            obj2["horario_inicio"] = $("#time_table").find('tr.active').find('td:eq( 1 )').text();
            obj2["horario_final"] = $("#time_table").find('tr.active').find('td:eq( 2 )').text();
            obj2["fecha"] = $("#time_table").find('tr.active').find('td:eq( 0 )').text();
            $.when(conexion("Conexiones", "create", obj2)).done(function(res) {
                console.log(res);
                if (res.Resultset == "true") {
                    swal("Success", "Meeting arranged", "success");
                    $("#dialog_arrange").dialog("close");
                    $.when(conexion("Conexiones", "select_pending", obj)).done(function(res) {
                        var trHtml = "";
                        var json = res.ResultSet;
                        for (let i = 0, length1 = json.length; i < length1; i++) {
                            trHtml += create_tr_with_id(json[i].id, json[i].nombre, json[i].horario_inicio, json[i].horario_final, json[i].fecha, json[i].mesa);
                        }
                        $("#Pending_meetings_tbody").find('tr').remove();
                        $("#Pending_meetings_tbody").append(trHtml);
                    });
                } else {
                    swal("Warning", "Select another time range", "warning");
                    $("#time_table tbody").find('tr').remove();
                    $.when(conexion("Conexiones", "horarios", obj)).done(function(res) {
                        var trHtml = "";
                        var json = res.ResultSet;
                        for (let i = 0, length1 = json.length; i < length1; i++) {
                            trHtml += create_tr_with_id("", json[i].dia, json[i].horario_inicio, json[i].horario_final);
                        }
                        $("#time_table").append(trHtml);
                    });
                }
            });
        });
    });

    $("#search_client").keydown(function(event) {
        var val = $("#search_client").val();
        for (let i = 0, length1 = clientes.length; i < length1; i++) {
            if (clientes[i].includes(val.toUpperCase())) {
                $("#find_meetings_tbody").find("#" + id_clientes[i]).show();
            } else {
                $("#find_meetings_tbody").find("#" + id_clientes[i]).hide();
            }
        }
    });
});

$("#profile").click(function(event) {
    var reader = new FileReader();
    $("#Enterprise_id_profile").val(localStorage.getItem("user"));

    obj["id"] = localStorage.getItem("user");

    var banderaTexto = "";
    var logoTexto = "";
    var personaTexto = "";

    $.when(conexion("Clientes", "getCliente", obj)).done(function(res) {
        console.log(res);
        $("#dialog_profile").fillInputs({ values: res.ResultSet[0] });
        var output = document.getElementById('flagDisplayArea');
        banderaTexto = res.ResultSet[0].bandera;
        output.src = banderaTexto;
    });

    $("#dialog_profile").dialog({
        width: 600,
        title: "Profile",
        buttons: {
            'Save': {
                text: 'Save',
                class: 'btn btn-success',
                id: 'save_profile_dialog'
            }
        },
        close: function(event) {

        }
    }).prev(".ui-dialog-titlebar").css("background", "#337ab7");

    $("#Enterprise_name_profile").val(localStorage.getItem("nombre"));

    $("#flag").change(function(event) {
        var input = event.target;
        reader.onload = function() {
            var dataURL = reader.result;
            var output = document.getElementById('flagDisplayArea');
            output.src = dataURL;
            banderaTexto = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
        console.log(reader);
    });

    $("#foto_persona").change(function(event) {
        var input = event.target;
        reader.onload = function() {
            var dataURL = reader.result;
            var output = document.getElementById('fileDisplayArea');
            output.src = dataURL;
            personaTexto = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
        console.log(reader);
    });
    
    $("#logo").change(function(event) {
        var input = event.target;
        reader.onload = function() {
            var dataURL = reader.result;
            var output = document.getElementById('logoDisplayArea');
            output.src = dataURL;
            logoTexto = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
        console.log(reader);
    });

    $("#save_profile_dialog").unbind().click(function(event) {
        var obj = $("#dialog_profile").createObject({ registro: localStorage.getItem("user") });
        obj["bandera"] = banderaTexto;
        obj["logo"] = logoTexto;
        obj["foto_persona"] = personaTexto;
        console.log(obj);
        $.when(conexion("Clientes", "save", obj)).done(function(res) {
            swal("Saved", "Changes Saved", "success");
        });
    });
});

// $("#test").click(function(event) {
//  var obj2 = new Object();
//  obj2["id"] = "5";
//  obj2["nombre"] = "Lugar raro";
//  obj2["direccion"] = "algun lugar";
//  obj2["pais"] = "argentina";
//  obj2["activo"] = "true";
//  obj2["mesas"] = "50";
//  obj2["horario_inicio"] = "15:00:00";
//  obj2["horario_final"] = "16:00:00";
//  obj2["tiempo_reunion"] = "15";
//  obj2["dia_inicio"] = "01-10-2018";
//  obj2["dia_final"] = "02-10-2018";
//     $.when(conexion("Lugar", "save", obj2)).done(function(res) {
//         console.log(res);
//     });
// });