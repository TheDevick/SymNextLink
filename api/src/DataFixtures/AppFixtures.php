<?php

namespace App\DataFixtures;

use App\Story\DefaultUrlsStory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        DefaultUrlsStory::load();
    }
}
