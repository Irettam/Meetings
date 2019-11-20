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
    $("#dialog_profile").dialog({
        width: 600,
        title: "Profile",
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
});

window.onload = function() {

    var fileInput = document.getElementById('Contact_photo');
    var fileDisplayArea = document.getElementById('fileDisplayArea');


    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var imageType = /image.*/;

        console.log(file);

        if (file.type.match(imageType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                fileDisplayArea.innerHTML = "";

                var img = new Image();
                img.src = reader.result;
                //img.src = "data:image/png;base64,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";
                fileDisplayArea.appendChild(img);
            }

            reader.readAsDataURL(file);

            console.log(reader);
        } else {
            fileDisplayArea.innerHTML = "File not supported!"
        }
    });

}

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