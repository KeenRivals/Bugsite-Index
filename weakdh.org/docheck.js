(function() {

    var displayResults = function(results) {
        tbody = $('#host-data');
        tbody.empty();
        results.map(function(res) { 
            var row = $('<tr></tr>');
            res.map(function(cell) {
                return $('<td></td>').append(cell);
            }).forEach(function(td) {
                row.append(td)
            }); 
            return row
        }).forEach(function(row) {
            tbody.append(row);
        });
    };

    var do_resize = function() {
        var size = document.body.scrollHeight;
        if (parent.logjam_resize) {
            parent.logjam_resize(size);
        }
    };

    var is_common = function(prime) {
        var common_primes = [
            "1n3kQMu73Bk21pPTSv0K1QyE0jmkX1ILuIF0y5i86VGEn5EuY5xy+xO0tNcXfhbVWsF5ukILKin+MkpGemNegf9ZATd77dz9MxaKRhqtO3La6IYAeARbB6fbynh0CH0VEOqfzJ3dMwUH3WLbiK6qdH3g9NbivWiw5zk+DyQhjrM=",
            "u7wtythGdJB8Q/z1gOnP29lYo/VotC1LCO7U6w+zUExsAwJ25xCADFzLuqiSJhTFvuylZaX98dKHorwEm+Z3gGDpGpKnV+MEj2iwdvfTbMjym6XfgdwspyXs5mJwzJpQNdjOzu+eoCdKY6seWPr9SYjQ9l0UZ1faBx3wRc/ha5s=",
            "5padPUlb4yx88YDDvdR5jpG3gYJRuwVeKiBkkEp5p3D6FaJZy9UjpqbvCcQwSNWiL5cfPCASm0gADm7dBhy8BT43HXlOUyffYR67vhusm1xgRM8CPXbgXuqbrZkbE6Y8l06e8YOetdsSUTb3Ji5WqIcVON/YI8ZQUIXiHw3VyGs=",
            "ybv193SoKXsPl83aOjRoxxF7a/eZoT2fH12sSHsiQf6V77E8KFXf0viYs/mRiOJO3zJt1ox2zIVTcoNRLUbxlTEpxpM2TYxxIC6rs+vIXB31OQf70LfrSQrQvJkoloaADEarBL983ZrUJeb7JVkutiWKBlXXXpOyZxdGrjSechs=",
            "zVwi+uoMU8OeYCJCwIj6DqMVhvRy6bBGBq7fs19WxJSAlfaHs4hXX6FwDbPQIlMCWlI6x26WRvdVoSM4ZTrgcctk8YVZHDTGZz+sm3jcTXHlPzpcymMm+JxUAPv4Jyp2NnxjDiNKkF5OVYzalopGoTatMIjdKV+TTsNq219pw/M=",
            "kkAkNcOhLkTTcw2OeMrfp44vW1GpVr/0245WUj6WleY+MlBs/rkS8qd9IucbtUyGgIk7gq0bzzN/f3eW0/uWgYHZuh9wNKv7H5ezEEzzID9mPoGZC34JD2xMXuGg5X7BdNPoStnnLmrH2mrqEt8pfBMYVPvyGsToecI7vGC091M=",
            "///////////JD9qiIWjCNMTGYouA3BzRKQJOCIpnzHQCC76mOxObIlFKCHmONATd75UZs806QxswKwpt8l8UN0/hNW1tUcJF5IW1dmJefsb0TELppjftawv/XLb0Brft7jhr+1qJn6WunyQRfEsf5kkoZlHs5lOB//////////8=",
            "1sCUrVf1N09o1Yx7CWhy2UXO4fgmZOBZRCHh1ePI6YvD8Kavj5Lxnj/vkze5m5yToFXVWpbkJXNABaaO1HBA/fAKVZNuukuT9ky6GgBORRNhHJshdDinA6IGDCA40M+q/7ukj7naxLJFDcWMsDIKAxfioxtEoCeHxlf7DAy+wR0=",
            "6eZCWZ01XzfJf/01ZxILjiXJzUPpJ7OpZw++xdiQFBki0sOzrSSACTeZhp0ehGqrSfqwrSbSzmoiIZ1HC859d31KIfvpwnC1f2BwAvPO+Dk2lM9F7jaIwRqMVqsSej2v",
            "sQuPlqCA4B3ekt5erl1U7FLJn7z7BqPGmmqdylLSO2Fgc+KGdaI9GJg47x4u5lLAE+y0rqkGESMkl1w81JuDv6zL3X2QxL1wmEiOnCGac3JO/9b65WRHOPqjGk/1W8zAoVGvXw3ItL1FvzffNlwaZeaM/adtTacI3x+yvC5KQ3E="
        ];
        if ($.inArray(prime, common_primes) >= 0) {
            return true;
        }
        return false;
    };

    var dhe_to_status = function(params) {
        if (!params) {
            return "unsupported";
        }
        if (params.prime_length < 1024) {
            return "short";
        }
        if (params.prime_length == 1024 && is_common(params.prime)) {
            return "common";
        }
        if (params.prime_length < 2048) {
            return "ok";
        }
        if (params.prime_length >= 2048) {
            return "strong";
        }
    };

    var status_to_html = function(s, params) {
        if (s == "unsupported") {
            return $("<p>").text("Not Supported"); 
        }
        bits = params.prime_length.toString();
        if (s == "short") {
            var warn_str = "Insecure Parameters (".concat(
                s,
                "-bit)");
            return $("<span class='text-danger'>").text(warn_str);
        }
        if (s == "common") {
            return $('<span class="text-warning">').text("Common 1024-bit Prime")
        }
        if (s == "ok" || s == "strong") {
            return $("<p>").text(bits.concat("-bits"))
        }
        return $("<p>");
    };

    var processCheck = function(check) {
        res = check.results;    
        if (!res || check.error) {
            var errString = check.error; 
            if (!errString) {
                errString = "Error connecting to server.";
            }
            $('#error-msg').text(errString).removeClass("hidden");
            return [];
        }

        $('#results-table').removeClass("hidden");

        var support_export = false;
        var support_short = false;
        var support_common = false;
        var support_ok = false;
        var support_strong = false;
        var unsupported = false;
        var any_has_tls = false;
        var ecdhe = true;
        var connected = false;

        clean_results = res.map(function(host) {

            var ip = host.ip;
            var err = host.error;
            var status_icon = "";
            var tls_icon = "";
            var export_html = "";
            var dhe_html = "";
            var chrome_html = "";

            if (err) {
                status_icon = "<span class='glyphicon glyphicon-remove'></span>"
                return [ip, status_icon, tls_icon, export_html, dhe_html, chrome_html];
            } else {
                status_icon = "<span class='glyphicon glyphicon-ok'></span>";
            }
            connected = true;
            var has_tls = host.has_tls;
            if (has_tls) {
                tls_icon = "<span class='glyphicon glyphicon-ok'></span>";
                any_has_tls = true;
            } else {
                tls_icon = "<span class='glyphicon glyphicon-remove'></span>";
            }
            if (host.export_dh_params != null) {
                export_html = "<span class='text-danger'>Supported!</span>";
                support_export = true;
            } else {
                export_html = "No";
            }
            dhe_status = dhe_to_status(host.dh_params);
            if (dhe_status == "short") {
                support_short = true;
            } else if (dhe_status == "common") {
                support_common = true;
            } else if (dhe_status == "ok") {
                support_ok = true;
            } else if (dhe_status == "strong") {
                support_strong = true;
            }
            dhe_html = status_to_html(dhe_status, host.dh_params);
            chrome_status = dhe_to_status(host.chrome_dh_params);
            if (host.chrome_cipher && host.chrome_cipher.indexOf("ECDHE") >= 0) {
                chrome_html = "<tt>ECDHE</tt>";
            } else {
                chrome_html = status_to_html(chrome_status, host.chrome_dh_params);
                ecdhe = false;
            }
            if (dhe_status == "unsupported" && !ecdhe) {
                unsupported = true;
            }
            return [ip, status_icon, tls_icon, export_html, dhe_html, chrome_html];
        });
        displayResults(clean_results);
        if (!connected || !any_has_tls) {
            return;
        }
        if (support_export) {
            $('#warn-export').removeClass("hidden");
        } else if (support_short) {
            $('#warn-short').removeClass("hidden");
        } else if (support_common) {
            $('#warn-common').removeClass("hidden");
        } else if (support_ok) {
            $('#warn-1024').removeClass("hidden");
        } else if (unsupported) {
            $('#nopfs').removeClass("hidden");
        } else if (support_strong) {
            $('#safe').removeClass("hidden");
        } else if (ecdhe) {
            $('#ecdhe').removeClass("hidden");
        }
    };

    var spinner = null;

    var show_progress = function() {
        var target = document.getElementById('spin-div');
        $('#test-button').addClass("disabled");
        spinner.spin(target);
    };

    var clear_progress = function() {
        spinner.stop();
        $('#test-button').removeClass("disabled");
    };
    
    var get_query_param = function(loc, variable) {
        var query = loc.search.substring(1);
        var vars = query.split("&");
        for (var i=0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {return pair[1];}
        }
        return(false);
    };

    var do_submit = function() {
        var server = $('#server-input').val();
        $('#error-msg').addClass("hidden");
        $('#results-table').addClass("hidden");
        $('#warn-export').addClass("hidden");
        $('#warn-short').addClass("hidden");
        $('#warn-common').addClass("hidden");
        $('#warn-1024').addClass("hidden");
        $('#safe').addClass("hidden");
        $('#ecdhe').addClass("hidden");
        $('#nopfs').addClass("hidden");
        $('#host-data').empty();
        var params = {
            server: server
        };
        $.ajax({
            url: "/check/",
            data: params,
            dataType: "json",
        }).done(function(data){
            processCheck(data);
        }).fail(function(jqxhr, textStatus, error) {
            $('#error-msg').text("Something went wrong. Try again later.").removeClass("hidden");
        }).always(function() {
            clear_progress();
            do_resize();
        });
    };

    $(document).ready(function() {

        var sp = get_query_param(document.location, "server");
        if (!sp && parent.location) {
            sp = get_query_param(parent.location, "server");
        }
        if (sp) {
            $('#server-input').val(sp);
            do_submit();
        }

        var opts = {
            lines: 13, // The number of lines to draw
            length: 10, // The length of each line
            width: 1, // The line thickness
            radius: 1, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '100%' // Left position relative to parent
        };
        spinner = new Spinner(opts);

        $('#test-form').submit(function(event) {
            event.preventDefault();
            show_progress();
            do_submit();
        });
    });
})();
