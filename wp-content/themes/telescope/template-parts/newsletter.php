<form method="GET" class="form-group form-newsletter" action="<?php echo get_the_permalink(); ?>">
    <label class="sa-label sr-only" for="newsletter-input">Newsletter</label>
    <input id="newsletter-input" class="form-control" name="search-input" type="text" placeholder="Votre e-mail">
    <button class="btn btn-primary" type="submit" aria-label="newsletter">
        Je m'inscris
        <span class="d-none spinner-grow spinner-grow-sm text-primary" role="status"></span>
    </button>
</form>
