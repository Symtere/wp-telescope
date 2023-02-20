        </main>

        <footer id="footer" class="footer">
            <div class="container">
                <div class="sup-footer d-flex flex-wrap flex-column flex-md-row flex-md-nowrap justify-content-md-between justify-content-start">
                    <div class="ft-brand text-md-center text-left">
                        <?php echo function_exists('get_acf_logo_footer') ? '<div class="ft-brand-img">' . get_acf_logo_footer() . '</div>' : ''; ?>
                        <?php echo function_exists('get_brand_informations') ? get_brand_informations() : ''; ?>
                    </div>
                    <?php echo function_exists('footer_nav') ? footer_nav() : ''; ?>
                    <div class="ft-social">
                        <div class="menu-nav-title">Suivez-nous</div>
                        <?php echo get_social_items(); ?>
                    </div>
                </div>
            </div>
            <?php /* ?>
            <div class="sub-footer">
                <div class="container">
                    <div class="d-md-flex align-items-center justify-content-between">
                        <div class="sf-links order-md-2 mb-3 mb-md-0">
                            <?php echo function_exists('rgpd_nav') ? rgpd_nav() : ''; ?>
                        </div>
                        <div class="d-flex flex-wrap ft-copyright align-items-center">
                            <div class="pe-2">
                                <?php echo __( "Copyright", 'custom' ); ?> <?php echo date( 'Y' ); ?>
                                © &nbsp;<span class="text-uppercase"><?php echo esc_attr(get_bloginfo( 'name' )); ?></span>
                                <?php echo __( "Réalisation et hébergement par", 'custom' ); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php */ ?>
        </footer>

        <?php get_template_part('template-parts/aside-menu'); ?>

        <?php wp_footer(); ?>
        </div>

        </body>

        </html>
