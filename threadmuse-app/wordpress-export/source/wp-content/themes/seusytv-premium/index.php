<?php
get_header();
?>
<main id="content" class="stv-page-shell">
    <?php while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'stv-page-content' ); ?>>
            <?php the_content(); ?>
        </article>
    <?php endwhile; ?>
</main>
<?php
get_footer();
