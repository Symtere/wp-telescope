<?php

$shortcodes = [
    'contact-map',
    'news-list',
    'newsletter',
];

foreach ( $shortcodes as $shortcode ) {
    require_once get_template_directory() . '/blocks/shortcodes/' . $shortcode . '.php';
}
