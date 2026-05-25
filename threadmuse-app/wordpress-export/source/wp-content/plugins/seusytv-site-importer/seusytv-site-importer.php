<?php
/**
 * Plugin Name: SeusyTV Site Importer
 * Description: Creates the premium IPTV pages, menus, front-page settings, and Elementor-friendly content for the SeusyTV theme after import.
 * Version: 1.0.0
 * Author: SeusyTV
 * Text Domain: seusytv-site-importer
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function seusytv_importer_pages() {
    return array(
        'home' => array( 'title' => 'Home', 'content' => '<!-- wp:html -->
<section class="stv-hero"><div class="stv-container stv-hero-grid"><div><span class="stv-kicker">Premium IPTV subscription provider</span><h1>Stream live TV, sports, movies, and series in a premium 4K IPTV experience.</h1><p class="stv-lead">Fast activation, 17,000+ global channels, 100,000+ VOD titles, premium support, and setup help for every screen.</p><div class="stv-actions"><a class="stv-button" href="/free-trial/">Start free trial</a><a class="stv-button stv-button-outline" href="/pricing/">View pricing</a></div><div class="stv-stats"><div class="stv-stat"><strong>17,000+</strong><span>live channels</span></div><div class="stv-stat"><strong>100,000+</strong><span>movies and series</span></div><div class="stv-stat"><strong>4K/FHD</strong><span>stream quality</span></div><div class="stv-stat"><strong>24/7</strong><span>human support</span></div></div></div><div class="stv-screen"><div class="stv-screen-bar"><span class="stv-screen-dot"></span><span class="stv-screen-dot"></span><span class="stv-screen-dot"></span></div><div class="stv-player"><span class="stv-kicker">Live sport 4K</span><h2>Match night without buffering.</h2><p>Premium routes for sports, news, movies, kids, and global entertainment.</p></div></div></div></section>
<section class="stv-section"><div class="stv-container"><div class="stv-section-head"><span class="stv-kicker">Why customers switch</span><h2>Built to feel like a premium streaming service, not a generic IPTV template.</h2></div><div class="stv-grid-4"><div class="stv-card"><span>Speed</span><strong>Low-buffer servers</strong><p>Stable routing for live sports, news, PPV, movies, and international channels.</p></div><div class="stv-card"><span>Devices</span><strong>Works everywhere</strong><p>Smart TV, Fire Stick, Android TV, iPhone, MAG, VLC, Kodi, and IPTV Smarters compatible.</p></div><div class="stv-card"><span>Activation</span><strong>Fast setup</strong><p>Start watching quickly after checkout or trial approval with setup guidance included.</p></div><div class="stv-card"><span>Guarantee</span><strong>Buyer safety</strong><p>Clear guarantee and visible support reduce anxiety before purchase.</p></div></div></div></section>
<section class="stv-section"><div class="stv-container stv-band"><div class="stv-grid-2"><div><span class="stv-kicker">Channel universe</span><h2>All the TV your audience is already searching for.</h2><p class="stv-lead">Global live channels, premium VOD, sports coverage, stable playback, and support convert better than vague claims.</p><a class="stv-button" href="/free-trial/">Test compatibility</a></div><div>[seusytv_features]</div></div></div></section>
<section class="stv-section"><div class="stv-container"><div class="stv-section-head"><span class="stv-kicker">Simple pricing</span><h2>Premium IPTV plans with clear value.</h2></div>[seusytv_pricing_cards]</div></section>
<section class="stv-section"><div class="stv-container stv-band"><span class="stv-kicker">FAQ</span><h2>Questions buyers need answered before purchasing.</h2>[seusytv_faq]</div></section>
<section class="stv-section"><div class="stv-container stv-band" style="text-align:center"><span class="stv-kicker">Ready to stream?</span><h2>Start with a free trial and confirm your device compatibility.</h2><p class="stv-lead" style="margin-left:auto;margin-right:auto">Choose a plan after testing quality, support, and app setup.</p><div class="stv-actions" style="justify-content:center"><a class="stv-button" href="/free-trial/">Request free trial</a><a class="stv-button stv-button-outline" href="/reseller/">Become a reseller</a></div></div></section>
<!-- /wp:html -->' ),
        'pricing' => array( 'title' => 'Pricing', 'content' => '<!-- wp:html -->
<section class="stv-hero"><div class="stv-container" style="text-align:center"><span class="stv-kicker">Transparent IPTV pricing</span><h1 class="stv-page-title">Pick a premium IPTV plan with confidence.</h1><p class="stv-lead" style="margin-left:auto;margin-right:auto">Clear pricing, visible guarantees, device support, and strong plan comparison remove purchase anxiety.</p></div></section>
<section class="stv-section"><div class="stv-container">[seusytv_pricing_cards]</div></section>
<section class="stv-section"><div class="stv-container stv-band"><div class="stv-grid-2"><div><span class="stv-kicker">Every plan includes</span><h2>The complete premium IPTV experience.</h2><p class="stv-lead">Value, quality, device support, and buyer safety are grouped in a scannable format.</p></div><div>[seusytv_features]</div></div></div></section>
<section class="stv-section"><div class="stv-container"><div class="stv-grid-3"><div class="stv-card"><span>Guarantee</span><strong>7 day satisfaction</strong><p>A clear guarantee improves buyer trust and checkout confidence.</p></div><div class="stv-card"><span>Activation</span><strong>Fast setup</strong><p>Activation and device guidance are part of the product value.</p></div><div class="stv-card"><span>Support</span><strong>Premium help</strong><p>Clear contact and email support are visible conversion assets.</p></div></div></div></section>
<section class="stv-section" id="faq"><div class="stv-container stv-band"><span class="stv-kicker">Pricing FAQ</span><h2>Plan questions answered.</h2>[seusytv_faq]</div></section>
<!-- /wp:html -->' ),
        'free-trial' => array( 'title' => 'Free Trial', 'content' => '<!-- wp:html -->
<section class="stv-hero"><div class="stv-container stv-hero-grid"><div><span class="stv-kicker">Risk-free IPTV test</span><h1>Request an IPTV free trial before you buy.</h1><p class="stv-lead">Test live channels, sports, VOD, quality, and device setup before choosing a plan.</p><div class="stv-actions"><a class="stv-button" href="/contact/">Request trial through contact</a><a class="stv-button stv-button-outline" href="/pricing/">See pricing</a></div></div><div class="stv-card"><span>Trial request</span><strong>Send your details</strong><p>Name, contact details, email, country, device type, and preferred plan.</p>[seusytv_contact_cards]</div></div></section>
<section class="stv-section"><div class="stv-container stv-band"><span class="stv-kicker">Trial flow</span><h2>Make testing feel simple and safe.</h2><div class="stv-grid-4"><div class="stv-card"><span>1</span><strong>Share device</strong><p>Tell support your device and country.</p></div><div class="stv-card"><span>2</span><strong>Receive login</strong><p>Get trial credentials and app guidance.</p></div><div class="stv-card"><span>3</span><strong>Test quality</strong><p>Check live TV, sports, movies, and VOD.</p></div><div class="stv-card"><span>4</span><strong>Choose plan</strong><p>Select the subscription that fits your viewing needs.</p></div></div></div></section>
<!-- /wp:html -->' ),
        'reseller' => array( 'title' => 'Reseller', 'content' => '<!-- wp:html -->
<section class="stv-hero"><div class="stv-container stv-hero-grid"><div><span class="stv-kicker">IPTV reseller program</span><h1>Launch a premium IPTV reseller business with stronger trust and cleaner sales flow.</h1><p class="stv-lead">Margin potential, panel access, activation workflow, and support are presented clearly for entrepreneurs.</p><div class="stv-actions"><a class="stv-button" href="/contact/">Apply through contact</a><a class="stv-button stv-button-outline" href="/pricing/">View retail plans</a></div></div><div class="stv-card"><span>Reseller snapshot</span><strong>Flexible credits</strong><p>Panel-assisted activation, support guidance, device setup help, and scalable packages.</p></div></div></section>
<section class="stv-section"><div class="stv-container"><div class="stv-section-head"><span class="stv-kicker">Why resellers choose SeusyTV</span><h2>A reseller page should sell confidence, not just cheap credits.</h2></div><div class="stv-grid-4"><div class="stv-card"><span>Margins</span><strong>Profit-ready tiers</strong><p>Price trials, monthly lines, and long-term offers with room for profit.</p></div><div class="stv-card"><span>Sales</span><strong>Premium positioning</strong><p>Cleaner copy and onboarding make your offer easier to sell.</p></div><div class="stv-card"><span>Support</span><strong>Reseller guidance</strong><p>Help with activation, troubleshooting, apps, and customer questions.</p></div><div class="stv-card"><span>Quality</span><strong>Stable lines</strong><p>Sell around reliability, device coverage, and buyer confidence.</p></div></div></div></section>
<section class="stv-section" id="terms"><div class="stv-container stv-band"><span class="stv-kicker">Reseller tiers</span><h2>Choose a launch, growth, or custom scale package.</h2><div class="stv-grid-3"><div class="stv-card"><span>Launch</span><strong>25 credits</strong><p>Testing the market with panel access and support.</p></div><div class="stv-card"><span>Growth</span><strong>100 credits</strong><p>Small agencies ready to scale customer activation.</p></div><div class="stv-card"><span>Scale</span><strong>Custom credits</strong><p>High-volume sellers with tailored support needs.</p></div></div></div></section>
<!-- /wp:html -->' ),
        'tutorial' => array( 'title' => 'Tutorial', 'content' => '<!-- wp:html -->
<section class="stv-hero"><div class="stv-container" style="text-align:center"><span class="stv-kicker">IPTV setup tutorial</span><h1 class="stv-page-title">Set up IPTV on Smart TV, Fire Stick, Android, iOS, and more.</h1><p class="stv-lead" style="margin-left:auto;margin-right:auto">Device-specific tutorials improve SEO, reduce support tickets, and help customers start streaming faster.</p><div class="stv-actions" style="justify-content:center"><a class="stv-button" href="/free-trial/">Request credentials</a><a class="stv-button stv-button-outline" href="/contact/">Ask support</a></div></div></section>
<section class="stv-section"><div class="stv-container"><div class="stv-grid-2"><div class="stv-card" id="smart-tv"><span>Smart TV</span><strong>Install IPTV player</strong><p>Install a trusted IPTV player, choose Xtream Codes or M3U login, enter credentials, refresh channels, and start streaming.</p></div><div class="stv-card" id="fire-stick"><span>Fire Stick</span><strong>Use Downloader</strong><p>Install Downloader, add your IPTV player, log in with Xtream Codes, and test playback.</p></div><div class="stv-card" id="android"><span>Android</span><strong>IPTV Smarters style app</strong><p>Select Xtream Codes API, enter server, username, and password, then download live TV, movies, and series.</p></div><div class="stv-card" id="apple"><span>Apple devices</span><strong>M3U or Xtream login</strong><p>Add your login to a compatible player, enable EPG where supported, and save favorites.</p></div></div></div></section>
<section class="stv-section"><div class="stv-container stv-band"><span class="stv-kicker">Playback checklist</span><h2>Improve stream quality before contacting support.</h2><div class="stv-feature-list"><div class="stv-feature-pill"><span>&check;</span>Use wired Ethernet or strong 5 GHz Wi-Fi for 4K streams.</div><div class="stv-feature-pill"><span>&check;</span>Restart router and device if channels buffer unexpectedly.</div><div class="stv-feature-pill"><span>&check;</span>Keep only one active stream per standard subscription line.</div><div class="stv-feature-pill"><span>&check;</span>Try another player for audio, subtitle, or EPG issues.</div></div></div></section>
<!-- /wp:html -->' ),
        'contact' => array( 'title' => 'Contact', 'content' => '<!-- wp:html -->
<section class="stv-hero"><div class="stv-container" style="text-align:center"><span class="stv-kicker">Contact support</span><h1 class="stv-page-title">Need IPTV help, a free trial, or reseller details?</h1><p class="stv-lead" style="margin-left:auto;margin-right:auto">Use the fastest contact channel for activation, setup, billing questions, and reseller applications.</p></div></section>
<section class="stv-section"><div class="stv-container">[seusytv_contact_cards]</div></section>
<section class="stv-section"><div class="stv-container stv-band"><span class="stv-kicker">Before contacting support</span><h2>Send the details that speed up troubleshooting.</h2><div class="stv-feature-list"><div class="stv-feature-pill"><span>&check;</span>Your device type and IPTV app name.</div><div class="stv-feature-pill"><span>&check;</span>Your internet speed and country.</div><div class="stv-feature-pill"><span>&check;</span>A screenshot of any login or playback error.</div><div class="stv-feature-pill"><span>&check;</span>Your order email or trial request name.</div></div></div></section>
<!-- /wp:html -->' ),
        'faq' => array( 'title' => 'FAQ', 'content' => '<!-- wp:html -->
<section class="stv-hero"><div class="stv-container" style="text-align:center"><span class="stv-kicker">FAQ</span><h1 class="stv-page-title">IPTV questions answered before you buy.</h1><p class="stv-lead" style="margin-left:auto;margin-right:auto">Clear answers improve trust, reduce support friction, and help customers choose the right plan.</p></div></section>
<section class="stv-section"><div class="stv-container stv-band">[seusytv_faq]</div></section>
<!-- /wp:html -->' ),
    );
}

function seusytv_site_importer_run() {
    if ( get_option( 'seusytv_site_imported' ) === '1' ) {
        return;
    }

    if ( wp_get_theme( 'seusytv-premium' )->exists() ) {
        switch_theme( 'seusytv-premium' );
    }

    $page_ids = array();
    foreach ( seusytv_importer_pages() as $slug => $page ) {
        $existing = get_page_by_path( $slug );
        $postarr = array(
            'post_title'   => $page['title'],
            'post_name'    => $slug,
            'post_content' => $page['content'],
            'post_status'  => 'publish',
            'post_type'    => 'page',
            'post_author'  => 1,
        );
        if ( $existing ) {
            $postarr['ID'] = $existing->ID;
            $page_id = wp_update_post( $postarr );
        } else {
            $page_id = wp_insert_post( $postarr );
        }
        if ( ! is_wp_error( $page_id ) ) {
            update_post_meta( $page_id, '_wp_page_template', 'page-full-width.php' );
            $page_ids[ $slug ] = $page_id;
        }
    }

    if ( ! empty( $page_ids['home'] ) ) {
        update_option( 'show_on_front', 'page' );
        update_option( 'page_on_front', $page_ids['home'] );
    }

    $menu_name = 'SeusyTV Primary Menu';
    $menu = wp_get_nav_menu_object( $menu_name );
    if ( ! $menu ) {
        $menu_id = wp_create_nav_menu( $menu_name );
    } else {
        $menu_id = $menu->term_id;
    }

    if ( ! is_wp_error( $menu_id ) ) {
        $items = wp_get_nav_menu_items( $menu_id );
        if ( empty( $items ) ) {
            foreach ( array( 'home', 'pricing', 'free-trial', 'reseller', 'tutorial', 'contact' ) as $slug ) {
                if ( empty( $page_ids[ $slug ] ) ) {
                    continue;
                }
                wp_update_nav_menu_item(
                    $menu_id,
                    0,
                    array(
                        'menu-item-title'     => get_the_title( $page_ids[ $slug ] ),
                        'menu-item-object-id' => $page_ids[ $slug ],
                        'menu-item-object'    => 'page',
                        'menu-item-type'      => 'post_type',
                        'menu-item-status'    => 'publish',
                    )
                );
            }
        }
        $locations = get_theme_mod( 'nav_menu_locations', array() );
        $locations['primary'] = $menu_id;
        $locations['footer'] = $menu_id;
        set_theme_mod( 'nav_menu_locations', $locations );
    }

    update_option( 'blogname', 'SeusyTV' );
    update_option( 'blogdescription', 'Premium IPTV streaming for every screen.' );
    update_option( 'permalink_structure', '/%postname%/' );
    set_theme_mod( 'seusytv_primary_cta_url', '/free-trial/' );
    set_theme_mod( 'seusytv_support_url', '/contact/' );
    set_theme_mod( 'seusytv_support_email', 'support@seusytv.com' );
    set_theme_mod( 'seusytv_guarantee', '7 day satisfaction guarantee' );
    update_option( 'seusytv_site_imported', '1' );
    flush_rewrite_rules();
}
add_action( 'init', 'seusytv_site_importer_run', 20 );
register_activation_hook( __FILE__, 'seusytv_site_importer_run' );
