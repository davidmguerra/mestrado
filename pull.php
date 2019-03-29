<?php
exec('git pull', $output);
?>
<script>
if (window.parent != window) {
    window.parent.location.reload(true);
}
</script>