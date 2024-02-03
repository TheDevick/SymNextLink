<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/** A Link */
#[ORM\Entity]
#[ApiResource]
class Url
{
    /** The ID of the URL */
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    private ?int $id = null;

    /** The Original URL */
    #[ORM\Column(length: 255, nullable: false)]
    #[Assert\NotBlank]
    #[Assert\Url]
    public ?string $longUrl = null;

    /** The Shortened URL */
    #[ORM\Column(length: 255, nullable: false)]
    public ?string $shortUrl = null;

    /** The creation date of the URL */
    #[ORM\Column(nullable: false)]
    #[Assert\NotNull]
    public ?\DateTimeImmutable $createDate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    #[ORM\PrePersist]
    public function setCreateDate(): void
    {
        $this->createDate = new \DateTimeImmutable('now');
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function setShortUrl(): void
    {
        $this->shortUrl = parse_url($this->longUrl, PHP_URL_HOST) . parse_url($this->longUrl, PHP_URL_PATH);
    }
}