<div id="aside-menu" class="aside-menu offcanvas offcanvas-start" tabindex="-1" aria-labelledby="aside-menu-label">
    <div class="offcanvas-header aside-header justify-content-between">
        <h5 id="aside-menu-label" class="sr-only">Navigation</h5>
        <div class="brand-header-mobile">
            <a class="navbar-brand" href="<?php echo site_url(); ?>">
                <?php echo function_exists('get_acf_logo_header') ? get_acf_logo_header() : ''; ?>
            </a>
        </div>
        <button type="button" class="aside-menu-btn-close btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Fermer">
            <span class="sr-only"><?php echo __('Fermer', 'webexpr'); ?></span>
        </button>
        <?php //echo function_exists('get_acf_logo_header') ? sprintf('<a href="%s" title="Accueil">%s</a>',get_site_url(),get_acf_logo_header('lazy')) : '';
        ?>
    </div>
    <div class="offcanvas-body d-flex flex-column justify-content-between">
        <div class="aside-menu-container d-flex">
            <?php echo function_exists('header_nav') ? header_nav('aside-nav') : ''; ?>
        </div>
        <?php
        $btn = get_field_option('button') ? get_field_option('button') : false;
        $btn_url = $btn ? esc_url($btn['url']) : false;
        $btn_title = $btn ? esc_attr($btn['title']) : '';
        $btn_target = $btn ? esc_attr(' target="' . $btn['target'] . '"') : '';
        echo $btn_url ? sprintf('<div class="aside-button"><a class="btn btn-primary w-100" href="%1$s" title="%2$s"%3$s>%4$s</a></div>', $btn_url, $btn_title, $btn_target, $btn_title) : '';
        ?>
    </div>
</div>
