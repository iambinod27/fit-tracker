import { Card, CardContent, CardHeader } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

const CardSkeleton = () => {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-5 w-24"></Skeleton>
            <Skeleton className="h-8 w-8 rounded-full"></Skeleton>
        </CardHeader>
        <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full"/>
            <Skeleton className="h-4 w-3/4"/>
        </CardContent>
    </Card>
  )
}
export default CardSkeleton