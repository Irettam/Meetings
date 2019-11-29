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
            serverCall: false,
            cambiarID: false,
            onDataReady: function(json) {}
        }, options);

        var obj = new Object();
        obj['id'] = settings.registro;

        var inputs = $(div).find(':input');
        var buttons = $(div).find(':button');
        var paragraphs = $(div).find('p');
        var tds = $(div).find('td');

        var data = settings.values;

        for (var key in data) {
            var value = data[key];

            if (value == 'True') {
                value = true;
                $('#' + key).prop("checked", true);
            } else {
                if (value == 'False') {
                    value = false;
                    $('#' + key).prop("checked", false);
                } else {
                    if ($('#' + key).is('INPUT') || $('#' + key).is('SELECT')) {
                        $('#' + key).val(value);
                    } else {
                        $('#' + key).text(value);
                    }
                }
            }
        }

        if (settings.cambiarID == true) {
            var aux_id = $(div).attr('id');
            $(div).attr('id', aux_id + settings.registro);
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
        obj['id'] = settings.registro;

        var inputs = $(this).find(':input:not(:button)');

        inputs.each(function(index, el) {
            var key = $(this).attr('id');;
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