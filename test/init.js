define(['jquery'], function($) {
    $.get('test/index.html', function(index) {
        console.log(index);
    });
});
