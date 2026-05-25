<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'SEUSYTV_THEME_VERSION', '1.0.0' );

function seusytv_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array( 'height' => 80, 'width' => 240, 'flex-height' => true, 'flex-width' => true ) );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
    add_theme_support( 'align-wide' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'elementor' );
    register_nav_menus(
        array(
            'primary' => __( 'Primary Menu', 'seusytv-premium' ),
            'footer'  => __( 'Footer Menu', 'seusytv-premium' ),
        )
    );
}
add_action( 'after_setup_theme', 'seusytv_setup' );

function seusytv_enqueue_assets() {
    wp_enqueue_style( 'seusytv-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap', array(), null );
    wp_enqueue_style( 'seusytv-theme', get_template_directory_uri() . '/assets/css/theme.css', array(), SEUSYTV_THEME_VERSION );
    wp_enqueue_script( 'seusytv-navigation', get_template_directory_uri() . '/assets/js/navigation.js', array(), SEUSYTV_THEME_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'seusytv_enqueue_assets' );

function seusytv_get_setting( $key, $default = '' ) {
    return get_theme_mod( 'seusytv_' . $key, $default );
}

function seusytv_customize_register( $wp_customize ) {
    $wp_customize->add_section(
        'seusytv_business',
        array(
            'title'       => __( 'SeusyTV Business Settings', 'seusytv-premium' ),
            'description' => __( 'Edit conversion links, contact details, and pricing copy used by dynamic sections.', 'seusytv-premium' ),
            'priority'    => 30,
        )
    );

    $settings = array(
        'primary_cta_url' => array( 'Primary CTA URL', '/free-trial/', 'url' ),
        'support_url' => array( 'Support URL', '/contact/', 'url' ),
        'support_email' => array( 'Support email', 'support@seusytv.com', 'email' ),
        'hero_badge' => array( 'Hero badge', 'Premium IPTV subscription provider', 'text' ),
        'guarantee' => array( 'Guarantee line', '7 day satisfaction guarantee', 'text' ),
        'plan_1_price' => array( '1 Month price', 'EUR 9', 'text' ),
        'plan_6_price' => array( '6 Months price', 'EUR 29', 'text' ),
        'plan_12_price' => array( '12 Months price', 'EUR 45', 'text' ),
        'plan_24_price' => array( '24 Months price', 'EUR 65', 'text' ),
    );

    foreach ( $settings as $key => $data ) {
        $wp_customize->add_setting(
            'seusytv_' . $key,
            array(
                'default'           => $data[1],
                'sanitize_callback' => 'seusytv_sanitize_customizer_setting',
            )
        );
        $wp_customize->add_control(
            'seusytv_' . $key,
            array(
                'label'   => $data[0],
                'section' => 'seusytv_business',
                'type'    => $data[2],
            )
        );
    }
}
add_action( 'customize_register', 'seusytv_customize_register' );

function seusytv_sanitize_customizer_setting( $value ) {
    if ( is_string( $value ) && 0 === strpos( $value, 'http' ) ) {
        return esc_url_raw( $value );
    }
    if ( is_email( $value ) ) {
        return sanitize_email( $value );
    }
    return sanitize_text_field( $value );
}

function seusytv_primary_cta_url() {
    return esc_url( seusytv_get_setting( 'primary_cta_url', '/free-trial/' ) );
}

function seusytv_support_url() {
    return esc_url( seusytv_get_setting( 'support_url', '/contact/' ) );
}

function seusytv_meta_description() {
    if ( is_front_page() ) {
        return 'Premium IPTV subscription provider with 17,000+ live channels, 100,000+ movies and series, 4K streaming, free trial, reseller plans, and setup support.';
    }

    $descriptions = array(
        'pricing'    => 'Compare SeusyTV IPTV pricing plans for 1 month, 6 months, 12 months, and 24 months with premium channels, VOD, support, and guarantee messaging.',
        'free-trial' => 'Request an IPTV free trial to test live channels, sports, VOD, stream quality, and device compatibility before choosing a SeusyTV plan.',
        'reseller'   => 'Start a premium IPTV reseller business with scalable credits, panel guidance, activation support, and conversion-ready sales positioning.',
        'tutorial'   => 'Follow IPTV setup tutorials for Smart TV, Fire Stick, Android, iOS, Apple TV, IPTV Smarters style apps, M3U, and Xtream Codes.',
        'contact'    => 'Contact SeusyTV for IPTV activation help, free trial requests, reseller details, device setup support, and billing questions.',
        'faq'        => 'Get answers to common IPTV subscription questions about activation, internet speed, devices, refunds, support, and multi-connection plans.',
    );

    $slug = is_page() ? get_post_field( 'post_name', get_queried_object_id() ) : '';
    return $descriptions[ $slug ] ?? get_bloginfo( 'description' );
}

function seusytv_output_seo_meta() {
    if ( is_admin() ) {
        return;
    }

    $description = seusytv_meta_description();
    $canonical   = is_singular() ? get_permalink() : home_url( add_query_arg( array(), $GLOBALS['wp']->request ?? '' ) );
    $title       = wp_get_document_title();
    ?>
    <meta name="description" content="<?php echo esc_attr( $description ); ?>">
    <link rel="canonical" href="<?php echo esc_url( $canonical ); ?>">
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?php echo esc_attr( $title ); ?>">
    <meta property="og:description" content="<?php echo esc_attr( $description ); ?>">
    <meta property="og:url" content="<?php echo esc_url( $canonical ); ?>">
    <meta property="og:site_name" content="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json"><?php echo wp_json_encode( array(
        '@context'    => 'https://schema.org',
        '@type'       => 'Organization',
        'name'        => get_bloginfo( 'name' ),
        'url'         => home_url( '/' ),
        'email'       => seusytv_get_setting( 'support_email', 'support@seusytv.com' ),
        'description' => get_bloginfo( 'description' ),
    ) ); ?></script>
    <?php
}
add_action( 'wp_head', 'seusytv_output_seo_meta', 1 );

function seusytv_plan_data() {
    return array(
        array( 'name' => '1 Month', 'price' => seusytv_get_setting( 'plan_1_price', 'EUR 9' ), 'badge' => 'Starter', 'note' => 'Best for testing', 'highlight' => false ),
        array( 'name' => '6 Months', 'price' => seusytv_get_setting( 'plan_6_price', 'EUR 29' ), 'badge' => 'Smart save', 'note' => 'Save more on steady viewing', 'highlight' => false ),
        array( 'name' => '12 Months', 'price' => seusytv_get_setting( 'plan_12_price', 'EUR 45' ), 'badge' => 'Most popular', 'note' => 'Best balance of value and support', 'highlight' => true ),
        array( 'name' => '24 Months', 'price' => seusytv_get_setting( 'plan_24_price', 'EUR 65' ), 'badge' => 'Best value', 'note' => 'Maximum long-term savings', 'highlight' => false ),
    );
}

function seusytv_features() {
    return array(
        '17,000+ worldwide live channels',
        '100,000+ movies and series',
        '4K, FHD, HD and SD quality',
        'All major IPTV apps supported',
        'Smart TV, Fire Stick, Android, iOS, MAG and PC',
        'Fast activation after confirmation',
        'Priority email and contact page support',
        'EPG guide where available',
    );
}

function seusytv_shortcode_pricing_cards() {
    ob_start();
    ?>
    <div class="stv-pricing-grid">
        <?php foreach ( seusytv_plan_data() as $plan ) : ?>
            <article class="stv-card stv-plan <?php echo $plan['highlight'] ? 'is-featured' : ''; ?>">
                <div class="stv-plan-head">
                    <h3><?php echo esc_html( $plan['name'] ); ?></h3>
                    <span><?php echo esc_html( $plan['badge'] ); ?></span>
                </div>
                <p><?php echo esc_html( $plan['note'] ); ?></p>
                <strong><?php echo esc_html( $plan['price'] ); ?></strong>
                <ul>
                    <li>1 active connection</li>
                    <li>17,000+ live channels</li>
                    <li>100,000+ VOD titles</li>
                    <li>4K/FHD/HD/SD quality</li>
                    <li>All devices supported</li>
                </ul>
                <a class="stv-button <?php echo $plan['highlight'] ? '' : 'stv-button-outline'; ?>" href="<?php echo seusytv_primary_cta_url(); ?>">Start with this plan</a>
            </article>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'seusytv_pricing_cards', 'seusytv_shortcode_pricing_cards' );

function seusytv_shortcode_features() {
    ob_start();
    ?>
    <div class="stv-feature-list">
        <?php foreach ( seusytv_features() as $feature ) : ?>
            <div class="stv-feature-pill"><span aria-hidden="true">&check;</span><?php echo esc_html( $feature ); ?></div>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'seusytv_features', 'seusytv_shortcode_features' );

function seusytv_faq_items() {
    return array(
        array( 'q' => 'How fast do I receive my IPTV subscription?', 'a' => 'Most orders are activated quickly after payment confirmation. Trial requests are reviewed and sent with setup instructions.' ),
        array( 'q' => 'What internet speed do I need?', 'a' => 'We recommend at least 25 Mbps for HD and 50 Mbps or more for the smoothest FHD and 4K playback.' ),
        array( 'q' => 'Can I use one plan on multiple devices?', 'a' => 'A standard line supports one active connection. Multi-connection and reseller options are available on request.' ),
        array( 'q' => 'Do you help with setup?', 'a' => 'Yes. The tutorial page covers popular devices and support can help you choose the right app.' ),
        array( 'q' => 'Is there a refund policy?', 'a' => 'The site highlights a 7 day satisfaction guarantee to reduce purchase risk and build trust before checkout.' ),
    );
}

function seusytv_shortcode_faq() {
    ob_start();
    ?>
    <div class="stv-faq-list">
        <?php foreach ( seusytv_faq_items() as $item ) : ?>
            <details class="stv-faq-item">
                <summary><?php echo esc_html( $item['q'] ); ?><span>+</span></summary>
                <p><?php echo esc_html( $item['a'] ); ?></p>
            </details>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'seusytv_faq', 'seusytv_shortcode_faq' );

function seusytv_shortcode_contact_cards() {
    $email = seusytv_get_setting( 'support_email', 'support@seusytv.com' );
    ob_start();
    ?>
    <div class="stv-contact-grid">
        <a class="stv-card" href="<?php echo seusytv_support_url(); ?>"><span>Contact</span><strong>Support request</strong><p>Trial requests, reseller questions, and activation help.</p></a>
        <a class="stv-card" href="mailto:<?php echo esc_attr( $email ); ?>"><span>Email</span><strong><?php echo esc_html( $email ); ?></strong><p>Send device details, order questions, and support requests.</p></a>
        <div class="stv-card"><span>Guarantee</span><strong><?php echo esc_html( seusytv_get_setting( 'guarantee', '7 day satisfaction guarantee' ) ); ?></strong><p>Clear buyer protection improves conversion confidence.</p></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'seusytv_contact_cards', 'seusytv_shortcode_contact_cards' );
