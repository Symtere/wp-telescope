<?php

function newsletter_shortcode($atts)
{
    ob_start();

    $atts = shortcode_atts(
        [],
        $atts
    );

    get_template_part( 'template-parts/newsletter', '', []);

    $content = ob_get_clean();
    return $content;
}

add_shortcode( 'newsletter', 'newsletter_shortcode' );
