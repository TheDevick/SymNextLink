<?php

namespace App\Story;

use App\Factory\UrlFactory;
use Zenstruck\Foundry\Story;

final class DefaultUrlsStory extends Story
{
    public function build(): void
    {
        // TODO build your story here (https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#stories)
        UrlFactory::createMany(100);
    }
}
