<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="stv-skip-link" href="#content"><?php esc_html_e( 'Skip to content', 'seusytv-premium' ); ?></a>
<header class="stv-site-header">
    <div class="stv-container stv-header-inner">
        <a class="stv-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php bloginfo( 'name' ); ?>">
            <?php if ( has_custom_logo() ) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <span class="stv-logo-mark">STV</span><span><?php bloginfo( 'name' ); ?></span>
            <?php endif; ?>
        </a>
        <button class="stv-menu-toggle" type="button" aria-expanded="false" aria-controls="stv-primary-menu">Menu</button>
        <nav id="stv-primary-menu" class="stv-primary-nav" aria-label="<?php esc_attr_e( 'Primary menu', 'seusytv-premium' ); ?>">
            <?php
            wp_nav_menu(
                array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'fallback_cb'    => 'seusytv_fallback_menu',
                    'menu_class'     => 'stv-menu',
                    'depth'          => 1,
                )
            );
            ?>
        </nav>
        <a class="stv-header-cta" href="<?php echo seusytv_primary_cta_url(); ?>">Start free trial</a>
    </div>
</header>
<?php
function seusytv_fallback_menu() {
    echo '<ul class="stv-menu"><li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li><li><a href="' . esc_url( home_url( '/pricing/' ) ) . '">Pricing</a></li><li><a href="' . esc_url( home_url( '/free-trial/' ) ) . '">Free Trial</a></li><li><a href="' . esc_url( home_url( '/reseller/' ) ) . '">Reseller</a></li><li><a href="' . esc_url( home_url( '/tutorial/' ) ) . '">Tutorial</a></li><li><a href="' . esc_url( home_url( '/contact/' ) ) . '">Contact</a></li></ul>';
}
?>
