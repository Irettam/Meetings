(function($) {
    //Agrega la seleccion a una tabla. Por defecto viene con seleccion completa
    //y se le puede pasar type:"simple" para seleccion normal
    $.fn.addSelection = function(options) {
        var that = this;

        var settings = $.extend({
            type: "all"
        }, options);

        that.find('tr').first().addClass('active');

        $(document).keydown(function(event) {
            if ($("#modal_help").is(":hidden") || $(that).parent("table").attr('id').includes("modal_table")) {
                if (shiftIsPressed && settings.type != 'simple') {
                    if (event.which == 38) {
                        if (that.find('tr.active').prev('tr').length > 0) {
                            var activar = that.find('tr.active').prev('tr');
                            activar.addClass('active');
                        }
                    }

                    if (event.which == 40) {
                        if (that.find('tr.active').next('tr').length > 0) {
                            var activar = that.find('tr.active').next('tr');
                            activar.addClass('active');
                        }
                    }
                } else {
                    if (event.which == 38) {
                        if (that.find('tr.active').prev('tr').length > 0) {
                            var activar = that.find('tr.active').first().prev('tr');
                            that.find('tr').removeClass('active');
                            activar.addClass('active');
                        }
                    }

                    if (event.which == 40) {
                        if (that.find('tr.active').next('tr').length > 0) {
                            var activar = that.find('tr.active').last().next('tr');
                            that.find('tr').removeClass('active');
                            activar.addClass('active');
                        }
                    }
                }
            }
        });

        that.on('click', 'tr', function(event) {
            if (settings.type == "simple") {
                if ($(this).hasClass('active')) {
                    //$(this).removeClass('active');
                } else {
                    that.find('tr').removeClass('active');
                    $(this).addClass('active');
                    //$(this).css('background-color', '#08C');
                }

            } else {
                if (cntrlIsPressed) {
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        //$(this).css('background-color', 'white');
                    } else {
                        $(this).addClass('active');
                        //$(this).css('background-color', '#08C');
                    }
                } else {
                    if (shiftIsPressed) {
                        $(this).addClass('active');
                        var firstrecord = that.find('tr.active').first().index();
                        var lastrecord = that.find('tr.active').last().index();
                        var marcar = false;
                        that.find('tr').each(function(index, el) {
                            if ($(this).index() == firstrecord) {
                                marcar = true;
                            }
                            if ($(this).index() == lastrecord) {
                                marcar = false;
                            }
                            if (marcar == true) {
                                $(this).addClass('active');
                                //$(this).css('background-color', '#08C');
                            }
                        });
                    } else {
                        if ($(this).hasClass('active')) {
                            that.find('tr').removeClass('active');
                            $(this).addClass('active');
                            //$(this).css('background-color', '#08C');
                        } else {
                            that.find('tr').removeClass('active');
                            $(this).addClass('active');
                            //$(this).css('background-color', '#08C');
                        }
                    }
                }
            }
        });
    };
}(jQuery));

(function($) {
    //Se le tiene que asociar a una tabla. Nada mas hay que pasarle el controller,
    //y es preferible que el body de la tabla tenga el mismo ID que la tabla_tbody,
    //pero no es obligatorio para el plugin. En caso de que sea necesario,
    //se le puede pasar un parametro mas para query en 4d
    //Se le pueden pasar los parametros para sacarle botones, la busqueda, y 
    //cambiarle el tipo de seleccion.
    $.fn.loadOutput = function(options) {

        var yo = this;

        var settings = $.extend({
            controller: yo.attr('controller'),
            pantalla: yo.attr('id'),
            search: true,
            selection: "all",
            refreshButton: true,
            editButton: true,
            newButton: true,
            deleteButton: true,
            printButton: false,
            contador: true,
            paginator: true,
            outputType: "normal",
            extraParam: null,
            specialFindby: null,
            specialValue: null,
            numeroPantalla: "0",
            numeroModulo: "0",
            numeroTabla: "0",
            onOperationMod: function(tr) {},
            onTableReady: function(json) {}
        }, options || {});

        var table;
        var page = 1;
        var finalpage;
        var field = "";
        var valor = "";
        var sentido = "desc";
        var campo = "id";

        cargarDivs();

        if (settings.specialFindby == null) {
            cargar_tabla(page, "getAll", "");
        } else {
            cargar_tabla(page, settings.specialFindby, settings.specialValue);
        }

        function cargar_tabla(currentpage, type, value) {
            var paginator = object_paginator(currentpage, 0, 30);
            var obj = new Object();
            obj['orden_sentido'] = sentido;
            obj['orden_campo'] = campo;
            if (settings.extraParam != null) {
                obj["extraParam"] = settings.extraParam;
            }
            if (type == "getAll" || value == "") {
                var server = new $4D.Server(settings.controller, "getAll", obj, paginator);
            } else {
                obj[type] = value;
                var server = new $4D.Server(settings.controller, "findby" + type, obj, paginator);
            }
            server.Success = function(json, pags, columns) {
                var trHtml = "";
                finalpage = pags.totalPage;
                paginate(settings.controller, settings.controller + '_paginador_' + settings.pantalla, pags, type, value);
                contador_de_registros(settings.controller + '_contador_' + settings.pantalla, json, pags);
                $(yo).children('tbody').children('tr').empty();
                for (var i = json.length - 1; i > -1; i--) {
                    var row = json[i];
                    let annulled = false;
                    if (json[i].Annulled != undefined) {
                        if (json[i].Annulled.toLowerCase() == "true") {
                            annulled = true;
                        }
                    }

                    if (annulled) {
                        trHtml += '<tr id=' + json[i].ID + ' class="anulled">';
                    } else {
                        trHtml += '<tr id=' + json[i].ID + '>';
                    }

                    if (settings.outputType.toLowerCase() == "operation") {
                        var color = json[i].Color;
                    }

                    var j = 1;
                    for (var key in row) {
                        if ($('#' + settings.pantalla + ' > thead > tr > th:nth-child(' + j + ')').css('display') != 'none') {
                            if (row[key] == 'True') {
                                trHtml += '<td key="' + key + '">\u2714</td>';
                            } else {
                                if (row[key] == 'False') {
                                    trHtml += '<td key="' + key + '">X</td>';
                                } else {
                                    if (settings.outputType.toLowerCase() != "normal") {
                                        trHtml += '<td style="white-space:nowrap;background-color:' + color + ';" key="' + key + '">' + row[key] + '</td>';
                                    } else {
                                        trHtml += '<td>' + row[key] + '</td>';
                                    }
                                }
                            }
                        } else {
                            if (row[key] == 'True') {
                                trHtml += '<td key="' + key + '" style="display:none;">\u2714</td>';
                            } else {
                                if (row[key] == 'False') {
                                    trHtml += '<td key="' + key + '" style="display:none;">X</td>';
                                } else {
                                    if (settings.outputType.toLowerCase() != "normal") {
                                        trHtml += '<td style="display:none;background-color:' + color + ';" key="' + key + '">' + row[key] + '</td>';
                                    } else {
                                        trHtml += '<td style="display:none;">' + row[key] + '</td>';
                                    }
                                }
                            }
                        }
                        j++;
                    }
                    trHtml += '</tr>';
                }
                $(yo).append(trHtml);
                if (table == undefined) {
                    var i = 1;
                    for (var key in json[0]) {
                        $('#' + settings.pantalla + ' > thead > tr > th:nth-child(' + i + ')').attr('value', key);
                        $('#' + settings.pantalla + ' > thead > tr > th:nth-child(' + i + ')').attr('sentido', 'asc');
                        $('#' + settings.pantalla + ' > thead > tr > th:nth-child(' + i + ')').addClass('task');
                        i++;
                    }
                    $(document).ready(function() {
                        if (settings.outputType.toLowerCase() == "normal") {
                            table = $(yo).DataTable({
                                responsive: true,
                                bPaginate: false,
                                compact: true,
                                ordering: false,
                                bFilter: false,
                                info: false
                            });
                        } else {
                            table = yo;
                            if (settings.outputType.toLowerCase() == "operation") {
                                var ancho = $('#GeneralNavTabs').width();
                                $(yo).css('width', ancho);
                                $(yo).children('thead').children('tr').children('th').css('width', '4cm');
                            }
                            $(yo).css("clear", "both");
                            $(yo).children('thead').css("background-color", "#337ab7");
                            $(yo).children('thead').children('tr').children('th').css("color", "white");
                            $(yo).css("border-color", "#337ab7");
                            $(yo).css("border-radius", "6px");
                            $(yo).css("margin-top:", "6px");
                            $(yo).css("margin-bottom", "6px");
                            $(yo).css("max-width", "none");
                        }

                    });
                    createSearch(columns, settings.controller + '_buscador_' + settings.pantalla);
                    $('#spinner_' + settings.pantalla).hide();
                    $(yo).show();
                    $("#" + settings.controller + '_buscador_' + settings.pantalla + "_Search > :input").keyup(function(event) {
                        var input = this;
                        keyUpDelay(function() {
                            valor = $(input).val();
                            field = $("#" + settings.controller + '_buscador_' + settings.pantalla + "_Search > select option:selected").attr('key');
                            page = 1;
                            cargar_tabla(page, field, valor);
                        });
                    });
                    search_order(settings.pantalla);
                }
                settings.onTableReady.call(json);
            };
            server.Error = function(json) {
                $(yo).children('tbody').empty();
                if (table == undefined) {
                    $(document).ready(function() {
                        table = $(yo).DataTable({
                            responsive: true,
                            bPaginate: false,
                            compact: true,
                            ordering: false,
                            bFilter: false,
                            info: false
                        });
                    });
                    createSearch("", settings.controller + '_buscador_' + settings.pantalla);
                    $('#spinner_' + settings.pantalla).hide();
                    $(yo).show();
                    $("#" + settings.controller + '_buscador_' + settings.pantalla + "_Search > :input").keyup(function(event) {
                        var input = this;
                        keyUpDelay(function() {
                            valor = $(input).val();
                            field = $("#" + settings.controller + '_buscador_' + settings.pantalla + "_Search > select option:selected").attr('key');
                            page = 1;
                            cargar_tabla(page, field, valor);
                        });
                    });
                    search_order(settings.pantalla);
                }
                settings.onTableReady.call(json);
            }
            server.Execute();
        }

        $('#' + settings.controller + '_paginador_' + settings.pantalla).on('click', 'a', function() {
            var this_page = $(this).text();
            if (this_page == "Previous" && page != 1) {
                page--;
                cargar_tabla(page, field, valor);
            }
            if (this_page == "Next" && page != finalpage) {
                page++;
                cargar_tabla(page, field, valor);
            }
            if (this_page != "Next" && this_page != "Previous") {
                page = parseInt(this_page);
                cargar_tabla(page, field, valor);
            }
        });

        $('.tooltip-demo').tooltip({
            selector: "[data-toggle=tooltip]",
            container: "body"
        });

        $(yo).children('tbody').addSelection({ type: settings.selection });

        $('#' + settings.pantalla + ' > thead > tr > th').click(function() {
            campo = $(this).attr('value');
            sentido = $(this).attr('sentido');
            if (sentido == 'asc') {
                $(this).attr('sentido', 'desc');
            } else {
                $(this).attr('sentido', 'asc');
            }
            page = 0;
            if (campo != "" && sentido != "") {
                cargar_tabla(page, field, valor);
            }
        });

        $('#refresh_table_' + settings.pantalla).click(function(event) {
            cargar_tabla(page, field, valor);
        });

        $("#export_" + settings.pantalla).click(function(event) {
            $("#modal_export_principal").modal('show');
            $("#name_export_modal").val("doc");

            var this_text = $(yo).parent().html();

            click_event_export(this_text);

            function click_event_export(this_text) {
                $("#modal_export_save").click(function(event) {
                    var nombre = $("#name_export_modal").val();
                    var blob = new Blob([this_text], { type: "text/plain;charset=utf-8" });
                    var extension = $("#export_extension").val();
                    saveAs(blob, nombre + extension);
                    $('#modal_export_principal').modal('hide');
                    $("#modal_export_save").unbind('click');
                    event.stopImmediatePropagation();
                });

            }

            $("#modal_export_close").click(function(event) {
                $("#modal_export_principal").modal('hide');
            });
        });

        if (settings.outputType.toLowerCase() == "operation") {
            $('#edit_record_' + settings.pantalla).click(function(event) {
                if ($(yo).find('input').length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, 'MOD')).done(function(res) {
                        var tr = $(yo).find('tr.active');
                        var regId = tr.find('td:eq( 0 )').text();
                        $.when(checkear(regId, settings.numeroTabla, settings.numeroPantalla)).fail(function(res) {
                            $(tr).createInputRow({ pantalla: settings.pantalla });
                            settings.onOperationMod.call(tr);
                            $(tr).find('td:eq(3)').find('input:first-child').focus();
                            $("#save_record_" + settings.pantalla).click(function(event) {
                                var error = $(tr).checkFields();
                                if (error == false) {
                                    var obj = $(tr).createObject({
                                        pantalla: settings.pantalla,
                                        registro: regId,
                                        controller: settings.controller,
                                        save: true,
                                        onSuccess: function() {
                                            $(tr).createInputRow({ mode: 'disable' });
                                            liberar(regId, settings.numeroTabla);
                                            $("#save_record_" + settings.pantalla).unbind('click');
                                        }
                                    });
                                }
                            });
                        });
                    });
                } else {
                    swal('Cuidado', 'Ya esta modificando un registro', 'warning');
                }
            });

            $('#new_record_' + settings.pantalla).click(function(event) {
                if ($(yo).find('input').length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, 'ING')).done(function(res) {
                        var datenow = new Date();
                        datenow = datenow.toLocaleDateString();
                        datenow = date_to_html(datenow);
                        var new_tr = $(yo).children('tbody').find('tr').first().clone();
                        new_tr.children('td').text("");
                        $(yo).prepend(new_tr);
                        $(new_tr).createInputRow({ pantalla: settings.pantalla });
                        var obj = new Object();
                        var serverid = new $4D.Server(settings.controller, "create_id", obj);
                        $.when(serverid.Execute()).done(function(respuesta) {
                            $(new_tr).find('td').first().text(respuesta.ID);
                            $(new_tr).attr('id', respuesta.ID);
                        });
                        new_tr.find('td:eq(2)').children('input').val(datenow);
                        new_tr.find('td:eq(3)').children('input').focus();
                        settings.onOperationMod.call(new_tr);
                        $("#save_record_" + settings.pantalla).click(function(event) {
                            var error = $(new_tr).checkFields();
                            if (error == false) {
                                var obj = $(new_tr).createObject({
                                    pantalla: settings.pantalla,
                                    registro: "record_vacio",
                                    controller: settings.controller,
                                    save: true,
                                    onSuccess: function(newId) {
                                        $(new_tr).find('td:eq(0)').text(newId.ID);
                                        $(new_tr).find('td:eq(1)').text(newId.status);
                                        $(new_tr).createInputRow({ mode: 'disable' });
                                        $("#save_record_" + settings.pantalla).unbind('click');
                                    }
                                });
                            }
                        });
                        $(window).keypress(function(event) {
                            if (event.which == 27) {
                                var delobj = new Object();
                                delobj['id'] = $(new_tr).attr('id');
                                var delserver = new $4D.server(settings.controller, "delete", delobj);
                                delserver.Success = function() {
                                    $(new_tr).remove();
                                };
                                delserver.Execute();
                            }
                            $(this).unbind(event);
                        });
                    });
                } else {
                    swal('Cuidado', 'No puede crear un registro mientras modifica otro', 'warning');
                }
            });
        }

        if (settings.outputType.toLowerCase() == "dialog") {
            $('#edit_record_' + settings.pantalla).click(function(event) {
                if ($(yo).find('input').length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, 'MOD')).done(function(res) {
                        var tr = $(yo).find('tr.active');
                        var regId = tr.find('td:eq( 0 )').text();
                        $.when(checkear(regId, settings.numeroTabla, settings.numeroPantalla)).fail(function(res) {
                            $(tr).createInputRow({ pantalla: settings.pantalla });
                            settings.onOperationMod.call(tr);
                            $(tr).find('td:eq(1)').find('input:first-child').focus();
                            $("#save_record_" + settings.pantalla).click(function(event) {
                                var error = $(tr).checkFields();
                                if (error == false) {
                                    var obj = $(tr).createObject({
                                        pantalla: settings.pantalla,
                                        registro: regId,
                                        controller: settings.controller,
                                        save: true,
                                        extraParam: settings.specialValue,
                                        onSuccess: function() {
                                            $(tr).createInputRow({ mode: 'disable' });
                                            liberar(regId, settings.numeroTabla);
                                            $("#save_record_" + settings.pantalla).unbind('click');
                                        }
                                    });
                                }
                            });
                        });
                    });
                } else {
                    swal('Cuidado', 'Ya esta modificando un registro', 'warning');
                }
            });

            $('#new_record_' + settings.pantalla).click(function(event) {
                if ($(yo).find('input').length == 0) {
                    $.when(verificar_permiso(settings.numeroModulo, settings.numeroPantalla, 'ING')).done(function(res) {
                        var new_tr = "<tr id='tr_vacio'>";
                        $(yo).children('thead').find('th').each(function(index, el) {
                            if ($(this).css('display') == "none") {
                                new_tr += "<td style='display:none' key='" + $(this).attr("key") + "'></td>";
                            } else {
                                new_tr += "<td key='" + $(this).attr("key") + "'></td>";
                            }
                        });
                        new_tr += "</tr>"
                        $(yo).prepend(new_tr);
                        new_tr = $(yo).children('tbody').find("tr").first();
                        $(new_tr).createInputRow({ pantalla: settings.pantalla });
                        settings.onOperationMod.call(new_tr);
                        $("#save_record_" + settings.pantalla).click(function(event) {
                            var error = $(new_tr).checkFields();
                            if (error == false) {
                                var obj = $(new_tr).createObject({
                                    pantalla: settings.pantalla,
                                    registro: "record_vacio",
                                    controller: settings.controller,
                                    extraParam: settings.specialValue,
                                    save: true,
                                    onSuccess: function(newId) {
                                        $(new_tr).find('td:eq(0)').text(newId.ID);
                                        $(new_tr).createInputRow({ mode: 'disable' });
                                        $("#save_record_" + settings.pantalla).unbind('click');
                                    }
                                });
                            }
                        });
                    });
                } else {
                    swal('Cuidado', 'No puede crear un registro mientras modifica otro', 'warning');
                }
            });
        }

        $(window).keypress(function(event) {
            if ($(yo).is(":visible")) {
                if (shiftIsPressed) {
                    switch (event.which) {
                        case 77:
                            $('#edit_record_' + settings.pantalla).trigger('click');
                            break;
                        case 13:
                            $("#save_record_" + settings.pantalla).trigger('click');
                            break;
                        case 78:
                            $('#new_record_' + settings.pantalla).trigger('click');
                            break;
                        case 68:
                            $('#delete_record_' + settings.pantalla).trigger('click');
                            break;
                        case 82:
                            $('#refresh_table_' + settings.pantalla).trigger('click');
                            break;
                        case 80:
                            $('#print_record_' + settings.pantalla).trigger('click');
                            break;
                    }
                }
            }
        });

        $('#delete_record_' + settings.pantalla).click(function(event) {
            let rec_id = $(yo).find('tbody').find('tr.active').first().attr("id");
            let pantalla = $("#GeneralNavTabs").find('li.active').children('a').text();
            cargarHistorial(pantalla, "DEL", rec_id);
        });

        function cargarDivs() {
            var div_buttons;

            if (settings.search == true) {
                var div_buscador = '<div id="' + settings.controller + '_buscador_' + settings.pantalla + '"style="float:left;"></div>';
                $(div_buscador).insertBefore(yo);
            }

            if (settings.contador == true) {
                var div_contador = '<div id="' + settings.controller + '_contador_' + settings.pantalla + '" style="float: left;width: 30%"></div>';
                $(yo).after(div_contador);
            }

            if (settings.paginator == true) {
                var div_paginador = '<div id="' + settings.controller + '_paginador_' + settings.pantalla + '" style="float: right;width: 50%"></div>';
                $(yo).after(div_paginador);
            }

            var div_video = '    <div class="footer navbar-fixed-bottom" style="display: none;" id="div_video_' + settings.pantalla + '"></div>'

            var div_spinner = '<div id="spinner_' + settings.pantalla + '" align="center"><br><br><br><br><br><img src="../dist/Images/spin.gif"></div>'

            div_buttons = '<div id="buttons_' + settings.pantalla + '" class="tooltip-demo" style="margin-top: 2mm;float: right;margin-bottom:1px;">';

            if (settings.deleteButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="DEL" class="btn btn-outline btn-danger btn-xs" id="delete_record_' + settings.pantalla + '" data-toggle="tooltip" title="Delete(Shift+D)"><i class="fa fa-minus"></i></button></span>';
            }

            if (settings.outputType.toLowerCase() != "normal") {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="ING" class="btn btn-outline btn-success btn-xs" id="save_record_' + settings.pantalla + '" data-toggle="tooltip" title="Save(Shift+Enter)"><i class="fa fa-check"></i></button></span>';
            }

            if (settings.editButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="MOD" class="btn btn-outline btn-warning btn-xs" id="edit_record_' + settings.pantalla + '" data-toggle="tooltip" title="Modify(Shift+M)"><i class="fa fa-pencil"></i></button></span>';
            }

            if (settings.newButton) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button permiso="ING" class="btn btn-outline btn-success btn-xs" id="new_record_' + settings.pantalla + '" data-toggle="tooltip" title="New(Shift+N)"><i class="fa fa-plus"></i></button></span>';
            }

            div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-info btn-xs" id="info_' + settings.pantalla + '" data-toggle="tooltip" href="http://www.latam-soft.com/es/soporte-en-linea/" title="Help"><i class="fa fa-info-circle"></i></button></span>';

            div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-danger btn-xs" id="video_' + settings.pantalla + '" data-toggle="tooltip" title="View Video"><i class="fa fa-youtube-play"></i></button></span>';

            if (settings.refreshButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-primary btn-xs" id="refresh_table_' + settings.pantalla + '" data-toggle="tooltip" title="Refresh(Shift+R)"><i class="fa fa-refresh"></i></button></span>';
            }

            if (settings.printButton == true) {
                div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-info btn-xs" id="print_record_' + settings.pantalla + '" data-toggle="tooltip" title="Print(Shift+P)"><i class="fa fa-print"></i></button></span>';
            }

            div_buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-warning btn-xs" id="export_' + settings.pantalla + '" data-toggle="tooltip" title="Export"><i class="fa fa-html5"></i></button></span>';

            div_buttons += '</div>';
            $(div_buttons).insertBefore(yo);
            $(div_spinner).insertBefore(yo);
            $(div_video).insertBefore(yo);
            $('#info_' + settings.pantalla).click(function(event) {
                $(this).attr("target", "_blank");
                window.open($(this).attr('href'));
            });
            $('#video_' + settings.pantalla).click(function(event) {
                $('#div_video_' + settings.pantalla).toggle();
            });
        }

    };
}(jQuery));

(function($) {
    //Carga todos los valores de un input y les cambia los id sumandole el id del registro.
    //Se le tiene que pasar el controller y el nombre de la pantalla, y por defecto trae los datos del servidor.
    //Para que funcione, los campos del input se deben llamar igual que el campo de la tabla mas 
    // el nombre de la pantalla ej: key +'_pantalla'. Tambien se le puede pasar un json a mano y realiza lo mismo. 
    $.fn.fillInputs = function(options) {

        var div = this;

        var settings = $.extend({
            values: null,
            controller: $(div).attr('controller'),
            pantalla: null,
            registro: 'vacio',
            serverCall: true,
            cambiarID: true,
            onDataReady: function(json) {}
        }, options);

        var obj = new Object();
        obj['id'] = settings.registro;

        var inputs = $(div).find(':input');
        var buttons = $(div).find(':button');
        var paragraphs = $(div).find('p');
        var tds = $(div).find('td');

        if (settings.cambiarID == true) {

            inputs.each(function(index, el) {
                var aux_id = $(this).attr('id');
                $(this).attr('id', aux_id + settings.registro);
            });

            paragraphs.each(function(index, el) {
                var aux_id = $(this).attr('id');
                $(this).attr('id', aux_id + settings.registro);
            });

            tds.each(function(index, el) {
                var aux_id = $(this).attr('id');
                $(this).attr('id', aux_id + settings.registro);
            });

        }

        if (settings.serverCall == true) {
            var server = new $4D.Server(settings.controller, 'getInput', obj);

            server.Success = function(json) {

                if (settings.cambiarID == false) {
                    settings.registro = "";
                }

                var data = json[0];

                for (var key in data) {
                    var value = data[key];

                    if (!Array.isArray(value)) {
                        if (value.toLowerCase() == 'true') {
                            value = true;
                            $('#' + key + '_' + settings.pantalla + settings.registro).prop("checked", true);
                        } else {
                            if (value.toLowerCase() == 'false') {
                                value = false;
                                $('#' + key + '_' + settings.pantalla + settings.registro).prop("checked", false);
                            } else {
                                if ($('#' + key + '_' + settings.pantalla + settings.registro).is('INPUT')) {
                                    $('#' + key + '_' + settings.pantalla + settings.registro).val(value);
                                } else {
                                    $('#' + key + '_' + settings.pantalla + settings.registro).text(value);
                                }
                            }
                        }
                    }
                }

                if (settings.cambiarID == true) {
                    var aux_id = $(div).attr('id');
                    $(div).attr('id', aux_id + settings.registro);
                }

                settings.onDataReady.call(json);
            }
            server.Error = function(json) {
                if (settings.cambiarID == true) {
                    var aux_id = $(div).attr('id');
                    $(div).attr('id', aux_id + settings.registro);
                }

                settings.onDataReady.call(json);
            }

            return server.Execute();

        } else {
            var data = settings.values;

            for (var key in data) {
                var value = data[key];

                if (value == 'True') {
                    value = true;
                    $('#' + key + '_' + settings.pantalla + settings.registro).prop("checked", true);
                } else {
                    if (value == 'False') {
                        value = false;
                        $('#' + key + '_' + settings.pantalla + settings.registro).prop("checked", false);
                    } else {
                        if ($('#' + key + '_' + settings.pantalla + settings.registro).is('INPUT')) {
                            $('#' + key + '_' + settings.pantalla + settings.registro).val(value);
                        } else {
                            $('#' + key + '_' + settings.pantalla + settings.registro).text(value);
                        }
                    }
                }
            }

            if (settings.cambiarID == true) {
                var aux_id = $(div).attr('id');
                $(div).attr('id', aux_id + settings.registro);
            }
        }

    };
}(jQuery));

(function($) {
    /**Se le tiene que pasar el controller y la pantalla.
    Recorre todos los campos del input y crea un objeto. 
    Se le puede decir que guarde directamente, pero se debe tener cuidado que los campos se llamen
    igual que las keys con el nombre de la pantalla y se le debe pasar el parametro
    save:'true'.*/
    $.fn.createObject = function(options) {

        var settings = $.extend({
            controller: $(this).attr('controller'),
            pantalla: null,
            registro: 'vacio',
            save: false,
            extraParam: null,
            esInforme: false,
            onSuccess: function() {},
            onError: function() {}
        }, options || {});

        var obj = new Object();
        obj['ID'] = settings.registro;

        var inputs = $(this).find(':input:not(:button)');

        inputs.each(function(index, el) {
            var auxId = $(this).attr('id');
            auxId = auxId.split('_' + settings.pantalla);
            var key = auxId[0];
            var value = "";
            if (!$(this)[0].hasAttribute("no-guardar")) {
                if ($(this).is(':checkbox')) {
                    if ($(this).prop('checked') == true) {
                        value = 'true';
                    } else {
                        value = 'false';
                    }
                } else {
                    if ($(this).attr('type') == 'date') {
                        if (settings.esInforme) {
                            value = fix_date_html($(this).val());
                        } else {
                            value = fix_date_html($(this).val(), true);
                        }
                    } else {
                        if ($(this).attr('type') == 'time') {
                            value = fix_time_html($(this).val());
                        } else {
                            value = $(this).val();
                            if (value == "\u2714") {
                                value = "true";
                            } else {
                                if (value == "X") {
                                    value = "false";
                                }
                            }
                        }
                    }
                }
                obj[key] = value;
            }
        });

        if (settings.save == true) {
            if (settings.extraParam != null) {
                obj["extraParam"] = settings.extraParam;
            }
            var server = new $4D.Server(settings.controller, 'save', obj);
            $.when(server.Execute()).done(function(a1) {
                settings.onSuccess.call(this, a1);
                swal("", "El registro se guardo correctamente", "success");
                let pantalla = $("#GeneralNavTabs").find('li.active').children('a').text();
                cargarHistorial(pantalla, "save", a1.ID);
                return a1;
            }).fail(function(error) {
                settings.onError.call(this);
                swal("Error", "Parece que ha ocurrido un error y no se ha podido guardar correctamente", "error");
            });
        }
        return obj;
    };
}(jQuery));

(function($) {
    //Inhabilita o deshabilita todos los campos de un input.
    //Se le tiene que asociar un div con todos los campos dentro, 
    //y se le puede pasar si se quieren deshabilitar los botones.
    //Para habilitar se le tiene que pasar el mode:'enable'
    $.fn.disableFields = function(options) {

        self = this;

        var settings = $.extend({
            mode: 'disable',
            buttons: false
        }, options);

        if (settings.buttons) {
            var inputs = $(self).find(':input');
        } else {
            var inputs = $(self).find(':input:not(:button)');
        }

        inputs.each(function(index, el) {
            if (!$(this)[0].hasAttribute("no-modificar")) {
                if (settings.mode == 'disable') {
                    $(this).attr('disabled', 'disabled');
                } else {
                    $(this).removeAttr('disabled');
                }
            }
        });
    };
}(jQuery));

(function($) {
    //Se le tiene que pasar el controller y la pantalla, revisa que esten llenos
    //todos los campos que tengan el atributo "obligatorio".
    //si encuentra un campo incompleto, lo marca en rojo y envia una alerta.
    //Devuelve un booleano, si encuentra un error devuelve true.
    $.fn.checkFields = function(options) {

        var settings = $.extend({}, options);

        var inputs = $(this).find(':input:not(:button)');

        var error = false;

        inputs.each(function(index, el) {
            if ($(this)[0].hasAttribute("obligatorio")) {
                if ($(this).val() == "") {
                    $(this).addClass('tiene-error');
                    error = true;
                } else {
                    if ($(this)[0].hasAttribute("min")) {
                        let valmin = $(this).attr("min");
                        if ($(this).val() < valmin) {
                            $(this).addClass('tiene-error');
                            error = true;
                        }
                    } else {
                        $(this).removeClass('tiene-error');
                    }
                }
            }
        });

        if (error == true) {
            swal("Atencion", "Debe completar todos los campos obligatorios", "warning");
        }

        return error;
    };
}(jQuery));

(function($) {
    //Se le tiene que añadir a el contenedor que tenga los campos
    //que tienen que tener el help, y rellena los primeros campos
    //con los valores que reciba, los campos deben tener el atributo findby.
    //Tambien, si es necesario, se le puede indicar desde que numero
    //de campo debe empezar a elegir y cuantos.
    //Si se necesita, se le puede pasar un parametros adicionales, y se
    //van a enviar con el nombre "adicional"
    $.fn.addHelpEvent = function(options) {

        var help = this;

        var settings = $.extend({
            controller: null,
            pantalla: null,
            mode: 'normal',
            comienzo: 0,
            cantidad: 0,
            parametrosAdicionales: null
        }, options || {});

        if (settings.mode == 'normal') {
            var obj = new Array();
            $(help).find(':input:not(:button):not(:checkbox)').each(function(index, el) {
                obj[index] = this;
            });
            for (var i = 0; i < obj.length; i++) {
                $(obj[i]).keydown(function(event) {
                    if (event.which == 9) {
                        var value = $(this).val();
                        var findby = $(this).attr('findby');
                        if (value != "") {
                            call_help(settings.controller, findby, value, settings.pantalla, obj, settings.parametrosAdicionales);
                        }
                    }
                });
            }
        } else {
            var obj = new Array();
            var entrar = 0;
            var dummy_index = 0;
            $(help).find(':input:not(:button):not(:checkbox)').each(function(index, el) {
                if (index == settings.comienzo) {
                    entrar = settings.cantidad;
                }
                if (entrar != 0) {
                    obj[dummy_index] = this;
                    entrar = entrar - 1;
                    dummy_index = dummy_index + 1;
                }
            });
            for (var i = 0; i < obj.length; i++) {
                $(obj[i]).keydown(function(event) {
                    if (event.which == 9) {
                        var value = $(this).val();
                        var findby = $(this).attr('findby');
                        if (value != "") {
                            call_help(settings.controller, findby, value, settings.pantalla, obj, settings.parametrosAdicionales);
                        }
                    }
                });
            }
        }

        return this;
    };
}(jQuery));

(function($) {
    //Genera una linea de inputs sobre un tr, cambiando cada td
    //y poniendole a cada input como id la key del td.
    //Si se le pasa disable, vuelve para atras.
    //Si al header se le pone el atributo no-modificar, ese campo no se modifica.
    //Si se necesita un tipo de campo especial, se le pasa en el atributo input-type
    $.fn.createInputRow = function(options) {

        var row = this;

        var settings = $.extend({
            mode: 'enable',
            pantalla: null
        }, options);

        var tds = $(row).children('td');

        tds.each(function(index, el) {
            if (index != 0) {
                var head = $(this).closest('table').find('th:nth-child(' + (index + 1) + ')');

                if (settings.mode == 'enable') {
                    var type = 'text';
                    var width = $(this).width();
                    if ($(head)[0].hasAttribute('input-type')) {
                        type = $(head).attr('input-type');
                    }
                    var key = $(this).attr('key');
                    var valor = $(this).text();
                    if ($(head).attr('input-type') == "number") {
                        valor = CorrectParseFloat(valor);
                    }
                    if (type == "button") {
                        var input = '<button id="' + key + '_' + settings.pantalla + '" class="form-control btn btn-default btn-xs"'
                    } else {
                        if ($(head)[0].hasAttribute('obligatorio')) {
                            var input = '<input id="' + key + '_' + settings.pantalla + '" type="' + type + '" value="' + valor + '" obligatorio';
                        } else {
                            var input = '<input id="' + key + '_' + settings.pantalla + '" type="' + type + '" value="' + valor + '"';
                        }
                    }
                    if ($(head)[0].hasAttribute('no-modificar')) {
                        input += ' disabled';
                    }

                    if ($(head)[0].hasAttribute('max')) {
                        input += ' max="' + $(head).attr("max") + '"';
                    }

                    if ($(head)[0].hasAttribute('min')) {
                        input += ' min="' + $(head).attr("min") + '"';
                    }

                    input += ' class="form-control"';

                    if ($(head)[0].hasAttribute('no-guardar')) {
                        input += ' no-guardar';
                    }

                    if ($(head)[0].hasAttribute('findby')) {
                        input += ' findby="' + $(head).attr('findby') + '"';
                    }

                    input += '>';

                    if (type == "button") {
                        input += key + '</button>';
                    }

                    $(this).html(input);

                    if ($(this).width() < 30) {
                        $(this).children('input').css('width', '30px');
                    }

                    if ($(this).width() < width) {
                        $(this).children('input').css('width', (width + 10) + 'px');
                    }
                } else {
                    var valor = $(this).children('input').val();
                    $(this).children('input').remove();
                    $(this).children('button').remove();
                    $(this).text(valor);
                }
            }
        });
    };
}(jQuery));

(function($) {
    //Destruye definitivamente el elemento, con todos sus hijos y eventos
    $.fn.destroyElement = function(options) {

        var settings = $.extend({}, options);

        $(this).unbind();
        $(this).empty();
        $(this).val("");
        if ($(this).children().length > 0) {
            $(this).children().each(function(index, el) {
                $(this).destroyElement();
            });
        }
        $(this).html("");
        $(this).remove();
    };
}(jQuery));

(function($) {
    //La funcion .val() no triggerea el .change()
    //pero este metodo si
    $.fn.changeVal = function(v) {
        return $(this).val(v).trigger("change");
    }
})(jQuery);

(function($) {
    //Hace el formateo del numero, tirandolo a la derecha, y arreglando el formato de numeros
    $.fn.numberFormat = function(options) {

        var settings = $.extend({}, options);


        if ($(this).is("input")) {
            var num = $(this).val();
            $(this).val(separate_number(format_number(num, CurrentUser.format), CurrentUser.format));
        } else {
            var num = $(this).text();
            $(this).text(separate_number(format_number(num, CurrentUser.format), CurrentUser.format));
        }

        $(this).css('text-align', 'right');

        return this;
    };
}(jQuery));

(function($) {
    //Agrega el conteo de registros que se refresca automaticamente cuando se refresca la cantidad de registros
    $.fn.contadorDeRegistros = function(options) {

        var cantidad = $(this).children('tbody').find('tr').length;

        $(this).after('<p id="contador_' + $(this).attr('id') + '">Showing 1 to ' + cantidad + ' of ' + cantidad + '</p>');

        $(this).change(function(event) {
            var cantidad = $(this).children('tbody').find('tr').length;

            $("#contador_" + $(this).attr('id')).text('Showing 1 to ' + cantidad + ' of ' + cantidad);
        });
    };
}(jQuery));

(function($) {
    //Agrega todo el formato a las pantallas de inputs largos, ver cotizacion para ejemplo.
    //Se le debe pasar el id del registro y el controller. En el flexbox title se le debe pasar
    //la variable del titulo para que la pueda traducir -> Hay que hacer esto
    $.fn.flexboxTransform = function(options) {

        self = this;

        var settings = $.extend({
            regId: "",
            controller: null
        }, options);

        $(self).addClass('panel panel-default big-flexbox');

        $(self).wrap('<div style="overflow: hidden;"><div>');

        $(self).css({
            "float": 'left',
            "width": '90%'
        });

        let mycode = settings.controller + '_' + settings.regId;

        let buttons = "";

        if (!isMobile.any()) {
            $(self).after('<div class="panel panel-default" style="overflow: hidden;width:9%;float:right;position:fixed;right:1%;"><div class="panel-heading">Index</div><div class="panel-body"><ul id="index_' + mycode + '" class=""></ul></div></div>');
        }

        $(self).before('<div id="buttons' + mycode + '" class="tooltip-demo" style="margin-top: 2mm;margin-bottom:2mm;overflow: hidden;"></div>');

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-danger btn-xs" id="close_record' + mycode + '" data-toggle="tooltip" title="Close"><i class="fa fa-times"></i></button></span>';

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-warning btn-xs" id="edit_record"' + mycode + ' data-toggle="tooltip" title="Edit"><i class="fa fa-pencil"></i></button></span>';

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-success btn-xs" id="save_record' + mycode + '" data-toggle="tooltip" title="Save"><i class="fa fa-check"></i></button></span>';

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-info btn-xs" data-toggle="tooltip" id="help' + mycode + '"" href="http://www.latam-soft.com/es/soporte-en-linea/" title="Help"><i class="fa fa-info-circle"></i></button></span>';

        buttons += '<span style="margin-left: 2mm;float: right;"><button class="btn btn-outline btn-danger btn-xs" data-toggle="tooltip" id="youtube' + mycode + '" title="View Video"><i class="fa fa-youtube-play"></i></button></span>'

        $("#buttons" + mycode).append(buttons);

        $(self).children('div').each(function(index, el) {
            $(this).addClass('panel panel-default title-flexbox-container');

            let titulo = $(this).attr('flexbox-title');

            if (!isMobile.any()) {
                $('#index_' + mycode).append('<li><a id="titulo_' + index + mycode + '">' + titulo + '</a></li>');

                $('#titulo_' + index + mycode).click(function(event) {
                    $('#hide_' + index + mycode).focus();
                });
            }

            let contenido = $(this).html();

            $(this).empty();

            if (!isMobile.any()) {
                $(this).prepend('<div id="titulo' + index + mycode + '" class="panel-heading"><button class="btn btn-danger btn-xs" id="hide_' + index + mycode + '"><i class="fa fa-minus"></i></button> ' + titulo + '</div><div class="panel-body"><div class="medium-flexbox">' + contenido + '</div></div>');
            } else {
                $(this).prepend('<div id="titulo' + index + mycode + '" class="panel-heading"><button class="btn btn-danger btn-xs" id="hide_' + index + mycode + '"><i class="fa fa-minus"></i></button> ' + titulo + '</div><div class="panel-body"><div class="medium-flexbox-phone">' + contenido + '</div></div>');
            }

            $("#hide_" + index + mycode).click(function(event) {
                $(this).children('i').remove();
                if ($("#titulo" + index + mycode).parent().children('div').last().is(":visible")) {
                    $(this).removeClass('btn-danger');
                    $(this).addClass('btn-success');
                    $(this).prepend('<i class="fa fa-plus"></i>');
                } else {
                    $(this).removeClass('btn-success');
                    $(this).addClass('btn-danger');
                    $(this).prepend('<i class="fa fa-minus"></i>');
                }
                $("#titulo" + index + mycode).parent().children('div').last().toggle('slow');
            });

            $(this).children('div').last().children('div').children('div').each(function(index, el) {
                $(this).addClass('panel panel-default small-flexbox');
                $(this).find('input:not(:checkbox)').addClass('form-control');
            });
        });

    };
}(jQuery));

(function($) {
    //Modifica todos los ids dentro del contenedor, les agrega un valor para que sean unicos
    $.fn.modifyAllIDs = function(options) {

        self = this;

        var settings = $.extend({
            value: undefined,
            buttons: true,
            inputs: true,
            tables: true,
            dontModify: null
        }, options);

        $(self).attr('id', $(self).attr('id') + settings.value);

        $(self).find('*').each(function(index, el) {
            let id = $(this).attr('id');
            if (id != undefined) {
                $(this).attr('id', id + settings.value);
            }
        });
    };
}(jQuery));

(function($) {
    //Agrega el formato a las tablas para que se vean lindas
    $.fn.tableFormat = function(options) {

        self = this;

        var settings = $.extend({
            contador: false,
            seleccion: null
        }, options);

        $(self).css('width', '100%');
        $(self).css("clear", "both");
        $(self).children('thead').css("background-color", "#337ab7");
        $(self).children('thead').children('tr').children('th').css("color", "white");
        $(self).children('thead').children('tr').children('th').css({ "height": "5px", "line-height": "5px" });
        $(self).css("border-color", "#337ab7");
        $(self).css("border-radius", "6px");
        $(self).css("margin-top:", "6px");
        $(self).css("margin-bottom", "6px");
        $(self).css("max-width", "none");

        if (settings.contador) {
            $(self).contadorDeRegistros();
        }

        if (settings.seleccion != null) {
            if (settings.seleccion == "simple") {
                $(self).find('tbody').addSelection({ type: "simple" });
            } else {
                $(self).find('tbody').addSelection();
            }
        }
    };
}(jQuery));

(function($) {
    //Copia una linea de una tabla sin los ID ni los valores
    $.fn.cleanCopy = function(options) {

        self = this;

        var settings = $.extend({
            newID: null
        }, options);

        let newTr = "<tr";

        if (settings.newID != null) {
            newTr += " id='" + settings.newID + "'";
        }

        newTr += ">";

        if ($(self).find('td').length == 0) {
            var mytds = $(self).find('th');
        } else {
            var mytds = $(self).find('td');
        }

        mytds.each(function(index, el) {
            if ($(this).css('display') == "none") {
                newTr += '<td style="display:none;"></td>';
            } else {
                newTr += "<td></td>";
            }
        });

        newTr += "</tr>";

        return newTr;

    };
}(jQuery));

(function($) {
    //Hace el formateo de los numeros de una columna, tirandolo a la derecha, y arreglando el formato de numeros
    $.fn.columnNumberFormat = function(options) {

        var settings = $.extend({
            column: null
        }, options);

        var table = this;

        $(table).find('tbody').find('tr').each(function(index, el) {
            var td = $(this).find('td:eq(' + settings.column + ')');
            if ($(td).is("input")) {
                var num = $(td).val();
                $(td).val(separate_number(format_number(num, CurrentUser.format), CurrentUser.format));
            } else {
                var num = $(td).text();
                $(td).text(separate_number(format_number(num, CurrentUser.format), CurrentUser.format));
            }
            $(td).css('text-align', 'right');
        });
    };
}(jQuery));

(function($) {
    //Agrega la suma tipo excel a una tabla
    $.fn.addExcelSum = function(options) {

        var settings = $.extend({}, options);

        var table = this;

        var cuenta = 0;

        var this_table_id = $(table).attr('id');

        $(table).after("<p style='background-color:rgba(244, 155, 66, 1);width:5cm;' id='" + this_table_id + "_excel_sum'></p>");

        $(table).find('tbody').click(function(event) {
            if (cntrlIsPressed) {
                if ($(event.target).hasClass('excel-sum')) {
                    cuenta -= CorrectParseFloat($(event.target).text());
                    $(event.target).removeClass('excel-sum');
                } else {
                    cuenta += CorrectParseFloat($(event.target).text());
                    $(event.target).addClass('excel-sum');
                }
            } else {
                cuenta = CorrectParseFloat($(event.target).text());
                $(".excel-sum").removeClass('excel-sum');
                $(event.target).addClass('excel-sum');
            }
            $("#" + this_table_id + "_excel_sum").text("Sum = " + numberFormat(String(cuenta)));
        });
    };
}(jQuery));