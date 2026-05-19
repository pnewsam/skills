BINARY := skills
MODULE := github.com/paulnewsam/skills/cli
COMMIT := $(shell git rev-parse --short HEAD)
LDFLAGS := -ldflags "-X main.buildCommit=$(COMMIT)"

.PHONY: build install clean setup

build:
	go build $(LDFLAGS) -o $(BINARY) ./cmd/skills

install:
	go install $(LDFLAGS) ./cmd/skills

setup: build
	./$(BINARY) setup

clean:
	rm -f $(BINARY)
