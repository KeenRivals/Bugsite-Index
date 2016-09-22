(function(){
    var suite_request_fail = false;
    var has_bad_cipher = false;
    var downgrade_vuln = false;
    var unknown = true;
    var double_timeout = false;

    log_status_manual = function(stat) {
        endpoint = "https://freakattack.com/status/".concat(stat);
        $.post(endpoint, { result: stat });
    };


    log_status = function() {
        if (unknown) {
            log_status_manual("unknown");
            $("#manual_check").removeClass("hidden");
            return;
        }
        if (double_timeout) {
            log_status_manual("timeout");
            $("#manual_check").removeClass("hidden");
            return;
        }
        if (has_bad_cipher && downgrade_vuln) {
            log_status_manual("vulnerable-downgrade-cipher")
            $("#vulnerable_notify").removeClass("hidden");
            $("#rsaexport_notify").removeClass("hidden");
            $("#safe_notify").addClass("hidden");
        } else if (has_bad_cipher && !downgrade_vuln) {
            log_status_manual("vulnerable-cipher");
            $("#rsaexport_notify").removeClass("hidden");
            $("#safe_notify").addClass("hidden");
        } else if (!has_bad_cipher && downgrade_vuln) {
            log_status_manual("vulnerable-downgrade");
            $("#vulnerable_notify").removeClass("hidden");
            $("#safe_notify").addClass("hidden");
        } else if (!has_bad_cipher && !downgrade_vuln) {
            log_status_manual("safe");
            $("#safe_notify").removeClass("hidden");
        }
    };

    var to = false;

    downgrade_request_retry = function() {
        $.ajax({
            url: 'https://tls11cve.freakattack.com',
            dataType: 'text',
            type: 'GET',
            async: true,
            statusCode: {
                200: function (response) {
                    downgrade_vuln = true;
                }
            },
            complete: function(jqXHR, textStatus) {
                if (!to && textStatus == "timeout") {
                    to = true;
                    downgrade_request_retry();
                } else if (to && textStatus == "timeout") {
                    double_timeout = true;
                    log_status();
                } else {
                    log_status();
                }
            }
        });
    };

    send_downgrade_request = function() {
        if (suite_request_fail) {
            return;
        }
        $.ajax({
            url: 'https://tls12cve.freakattack.com',
            dataType: 'text',
            type: 'GET',
            async: true,
            statusCode: {
                200: function (response) {
                    downgrade_vuln = true;
                    log_status();
                }
            },
            error: function (jqXHR, status, errorThrown) {
                downgrade_request_retry();
            }
        });
    }; 

    send_suites_request = function() {
        $.ajax({
            url: 'https://ciphers.freakattack.com',
            dataType: 'json',
            type: 'GET',
            async: true,
            statusCode: {
                200: function(response) {
                    if (!response || !response.ciphers || response.ciphers.length == 0) {
                        suite_request_fail = true;
                        return;
                    }
                    unknown = false;
                    $.each(response.ciphers, function(i, item) {
                        var row = $("<tr /> <td>" + item.name + "</td></tr>");
                        var bad_ciphers = [ 
                            "0x0003",
                            "0x0006",
                            "0x0008",
                            "0x000E",
                            "0x0014",
                            "0x0060",
                            "0x0061",
                            "0x0062",
                            "0x0064"  
                        ];
                        if ($.inArray(item.hex, bad_ciphers) != -1) {
                            has_bad_cipher = true;
                        } 
                        $("#cipherTable").append(row);
                    });
                    if (has_bad_cipher) {
                        vuln = true;
                        $("#safe_notify").addClass("hidden");
                    }
                }
            },
            complete: function(jqXHR, status) {
                if (status == "success" && !suite_request_fail) {
                    send_downgrade_request();
                } else {
                    log_status();
                }
            }
        });
    };

    is_old_ie = function() {
        if ($('html').is('.old-ie')) {
            return true;
        }
        return false;
    };

    send_requests = function() {
        if (is_old_ie()) {
            log_status();
        } else {
            send_suites_request();
        }
    }
    $(document).ready(send_requests)
})();
