interface DrawingCardProps{
    title: string
}

export function DrawingCard ({title}:DrawingCardProps) {
    return (
        <div>
            {title}
        </div>
    );
}