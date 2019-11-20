var cntrlIsPressed = false;
var shiftIsPressed = false;
var comIsPressed = false;
var altIsPressed = false;

$(document).keydown(function(event) {
    if (event.which == "91") {
        comIsPressed = true;
    }
    if (event.which == "17") {
        cntrlIsPressed = true;
    }
    if (event.which == "16") {
        shiftIsPressed = true;
    }
    if (event.which == "18") {
        altIsPressed = true;
    }
});

$(document).keyup(function() {
    if (event.which == "91") {
        comIsPressed = false;
    }
    if (event.which == "17") {
        cntrlIsPressed = false;
    }
    if (event.which == "16") {
        shiftIsPressed = false;
    }
    if (event.which == "18") {
        altIsPressed = false;
    }
});

function conexion(controller, action, param) {
	var user = new Object();
	param["controller"] = controller;
	param["action"] = action;
	param["user"] = "1";
    return $.ajax({
        type: "GET",
        url: 'http://localhost:31093/HelloWorldApplication/webresources/Conexion/' + JSON.stringify(param),
        success: function(data){
        	return data;
        },
        error: function(data) {
        	return data;
        }
    })
    
}

function create_tr_var(json) {
    var trHtml = "";
    for (var i = 0; i < json.length; i++) {
        trHtml += '<tr id=' + json[i].id + '>';
        var row = json[i];
        for (var key in row) {
            trHtml += '<td>' + row[key] + '</td>';
        }
        trHtml += '</tr>';
    }
    return trHtml;
}

function create_tr_with_id(id) {
    var len = arguments.length;
    var trHTML = '<tr id="' + id + '"">';
    for (var i = 1; i < len; i++) {
        trHTML += "<td>" + arguments[i] + '</td>';
    }
    trHTML += '</tr>';
    return trHTML;
}

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