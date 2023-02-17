<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <meta http-equiv="Content-Security-Policy" content="base-uri 'self'">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <div class="main-wrapper">
        <header id="header" class="site-header">
            <div class="container">
                <div class="header-wr d-flex justify-content-between align-items-center">
                    <div class="brand-header">
                        <a class="navbar-brand" href="<?php echo site_url(); ?>">
                            <?php echo function_exists('get_acf_logo_header') ? get_acf_logo_header() : ''; ?>
                        </a>
                    </div>
                    <nav class="navbar navbar-expand-lg navbar-light d-none d-xl-flex">
                        <?php echo function_exists('header_nav') ? header_nav() : ''; ?>
                    </nav>
                    <?php
                    $btn = get_field_option('button') ? get_field_option('button') : false;
                    $btn_url = $btn ? esc_url($btn['url']) : false;
                    $btn_title = $btn ? esc_attr($btn['title'] ): '';
                    $btn_target = $btn ? esc_attr(' target="'. $btn['target'] . '"') : '';

                    echo $btn_url ? sprintf('<div class="navbar-button d-none d-xl-flex"><a class="btn btn-primary" href="%1$s" title="%2$s"%3$s>%4$s</a></div>',$btn_url,$btn_title,$btn_target,$btn_title) : ''; ?>
                    <div class="aside-nav-wr d-xl-none">
                        <button class="aside-menu-toggler btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#aside-menu" aria-controls="aside-menu" aria-label="<?php echo __( 'Navigation', 'custom' ); ?>">
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
        <main id="main" class="site-main">
