(function($){
    $(function(){
        
        $("#src, #other a").click(function(){
            var slow = $("#slow").get(0).checked;

            $("#dest").data("origin", this);
            $("#dest").growFrom(this, {
                duration: slow ? 5000 : 300
            });
            return false;
        });

        $("#close, #dest img").click(function(){
            var slow = $("#slow").get(0).checked;

            $(this).closest("div").shrinkTo($("#dest").data("origin"), {
                duration: slow ? 5000 : 300
            });
            return false;
        });

    });
})(jQuery);
