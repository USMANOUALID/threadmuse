<?php
/* Template Name: SeusyTV Full Width */
get_header();
?>
<main id="content" class="stv-page-shell stv-page-full">
    <?php while ( have_posts() ) : the_post(); ?>
        <?php the_content(); ?>
    <?php endwhile; ?>
</main>
<?php
get_footer();
