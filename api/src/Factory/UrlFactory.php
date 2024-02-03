<?php

namespace App\Factory;

use App\Entity\Url;
use Doctrine\ORM\EntityRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<Url>
 *
 * @method        Url|Proxy                        create(array|callable $attributes = [])
 * @method static Url|Proxy                        createOne(array $attributes = [])
 * @method static Url|Proxy                        find(object|array|mixed $criteria)
 * @method static Url|Proxy                        findOrCreate(array $attributes)
 * @method static Url|Proxy                        first(string $sortedField = 'id')
 * @method static Url|Proxy                        last(string $sortedField = 'id')
 * @method static Url|Proxy                        random(array $attributes = [])
 * @method static Url|Proxy                        randomOrCreate(array $attributes = [])
 * @method static EntityRepository|RepositoryProxy repository()
 * @method static Url[]|Proxy[]                    all()
 * @method static Url[]|Proxy[]                    createMany(int $number, array|callable $attributes = [])
 * @method static Url[]|Proxy[]                    createSequence(iterable|callable $sequence)
 * @method static Url[]|Proxy[]                    findBy(array $attributes)
 * @method static Url[]|Proxy[]                    randomRange(int $min, int $max, array $attributes = [])
 * @method static Url[]|Proxy[]                    randomSet(int $number, array $attributes = [])
 */
final class UrlFactory extends ModelFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function getDefaults(): array
    {
        return [
            'createDate' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'longUrl' => self::faker()->url(),
            'shortUrl' => self::faker()->url(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): self
    {
        return $this
            // ->afterInstantiate(function(Url $url): void {})
        ;
    }

    protected static function getClass(): string
    {
        return Url::class;
    }
}
