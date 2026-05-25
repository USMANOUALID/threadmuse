<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>
<footer class="stv-site-footer">
    <div class="stv-container stv-footer-grid">
        <div>
            <a class="stv-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>"><span class="stv-logo-mark">STV</span><span><?php bloginfo( 'name' ); ?></span></a>
            <p>Premium IPTV with fast activation, 17,000+ live channels, 100,000+ VOD titles, reseller support, and setup guidance for every screen.</p>
        </div>
        <div>
            <h2>Services</h2>
            <a href="<?php echo esc_url( home_url( '/pricing/' ) ); ?>">IPTV subscriptions</a>
            <a href="<?php echo esc_url( home_url( '/free-trial/' ) ); ?>">Free trial</a>
            <a href="<?php echo esc_url( home_url( '/reseller/' ) ); ?>">Reseller program</a>
            <a href="<?php echo esc_url( home_url( '/tutorial/' ) ); ?>">Setup tutorial</a>
        </div>
        <div>
            <h2>Support</h2>
            <a href="<?php echo seusytv_support_url(); ?>">Support request</a>
            <a href="mailto:<?php echo esc_attr( seusytv_get_setting( 'support_email', 'support@seusytv.com' ) ); ?>">Email support</a>
            <a href="<?php echo esc_url( home_url( '/faq/' ) ); ?>">FAQ</a>
            <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a>
        </div>
        <div>
            <h2>Devices</h2>
            <a href="<?php echo esc_url( home_url( '/tutorial/#smart-tv' ) ); ?>">Smart TV</a>
            <a href="<?php echo esc_url( home_url( '/tutorial/#fire-stick' ) ); ?>">Fire Stick</a>
            <a href="<?php echo esc_url( home_url( '/tutorial/#android' ) ); ?>">Android TV</a>
            <a href="<?php echo esc_url( home_url( '/tutorial/#apple' ) ); ?>">Apple devices</a>
        </div>
    </div>
    <div class="stv-container stv-footer-bottom">
        <span>Copyright <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. Premium IPTV support.</span>
        <span>4K ready streams - secure checkout - <?php echo esc_html( seusytv_get_setting( 'guarantee', '7 day satisfaction guarantee' ) ); ?></span>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
